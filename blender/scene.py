"""
序幕「点てる」の Blender シーン（Cycles）。

使い方:
  blender -b -P blender/scene.py -- --out /path/frame.png [--w 1920 --h 1080 --samples 256] [--whisk 0.7] [--pose cut04]

座標: Z が上。カウンター天板 z=0、茶碗の口 z=0.075。単位はメートル。
three.js 版（(x,y,z)=右,上,手前）からは (x, -z, y) で写す。
"""
import bpy, bmesh, math, sys, os, random
from mathutils import Vector, Euler

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "素材_3D"))
TEX = os.path.join(ROOT, "textures")
HDRI = os.path.join(ROOT, "hdri")

# ---------- 引数 ----------
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default):
    if name in argv:
        v = argv[argv.index(name) + 1]
        return type(default)(v) if default is not None else v
    return default
OUT = arg("--out", "/tmp/chasen_lookdev.png")
W, H = arg("--w", 1920), arg("--h", 1080)
SAMPLES = arg("--samples", 256)
WHISK = arg("--whisk", 0.75)   # 0=茶筅なし・泡なし 1=点て上がり
POSE = arg("--pose", "cut04")
LIGHTS = arg("--lights", "Shoji,Rim,Top")

random.seed(20260905)

# ---------- 片付け ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = True
scene.cycles.device = "GPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.01
scene.cycles.max_bounces = 8
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.resolution_x, scene.render.resolution_y = W, H
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_depth = "16"
scene.render.filepath = OUT
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = -0.25
scene.render.film_transparent = False

# ---------- ヘルパ ----------
def set_input(node, name, value):
    """Principled の入力名は版で変わるので、無い名前は無視する"""
    if name in node.inputs:
        node.inputs[name].default_value = value
        return True
    return False

def new_material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m, nt, bsdf, out

def img_node(nt, path, non_color=False):
    n = nt.nodes.new("ShaderNodeTexImage")
    n.image = bpy.data.images.load(path)
    if non_color:
        n.image.colorspace_settings.name = "Non-Color"
    return n

def pbr_material(name, folder, prefix, scale=1.0, tint=(1, 1, 1, 1), rough_mul=1.0, bump=0.4):
    m, nt, bsdf, out = new_material(name)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])

    diff = img_node(nt, os.path.join(folder, f"{prefix}_diff_2k.jpg"))
    nor = img_node(nt, os.path.join(folder, f"{prefix}_nor_gl_2k.jpg"), True)
    rough = img_node(nt, os.path.join(folder, f"{prefix}_rough_2k.jpg"), True)
    for n in (diff, nor, rough):
        n.projection = "BOX"
        n.projection_blend = 0.2
        nt.links.new(mapping.outputs["Vector"], n.inputs["Vector"])

    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    nt.links.new(diff.outputs["Color"], mix.inputs[6])
    mix.inputs[7].default_value = tint
    nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])

    rm = nt.nodes.new("ShaderNodeMath")
    rm.operation = "MULTIPLY"
    rm.inputs[1].default_value = rough_mul
    nt.links.new(rough.outputs["Color"], rm.inputs[0])
    nt.links.new(rm.outputs[0], bsdf.inputs["Roughness"])

    nm = nt.nodes.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = bump
    nt.links.new(nor.outputs["Color"], nm.inputs["Color"])
    nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    return m

def add_obj(name, mesh):
    o = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(o)
    return o

def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True

# ---------- 世界（HDRI） ----------
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
wn = world.node_tree
for n in list(wn.nodes):
    wn.nodes.remove(n)
wout = wn.nodes.new("ShaderNodeOutputWorld")
bg = wn.nodes.new("ShaderNodeBackground")
# HDRI（comfy_cafe 等）は窓の輝度が高すぎて天板が全面明るくなるので使わない。
# 暗い茶室: ほぼ黒の空に、ごく弱い暖色の返りだけ
bg.inputs["Color"].default_value = (0.35, 0.28, 0.20, 1)
bg.inputs["Strength"].default_value = 0.02
wn.links.new(bg.outputs["Background"], wout.inputs["Surface"])
# カメラには HDRI を見せない（背景は暗い壁が受ける）
lp = wn.nodes.new("ShaderNodeLightPath")
mixw = wn.nodes.new("ShaderNodeMixShader")
black = wn.nodes.new("ShaderNodeBackground")
black.inputs["Color"].default_value = (0.004, 0.004, 0.0035, 1)
wn.links.new(lp.outputs["Is Camera Ray"], mixw.inputs["Fac"])
wn.links.new(bg.outputs["Background"], mixw.inputs[1])
wn.links.new(black.outputs["Background"], mixw.inputs[2])
wn.links.new(mixw.outputs["Shader"], wout.inputs["Surface"])

# ---------- ライト ----------
def area(name, loc, target, size, power, color, size_y=None):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = "RECTANGLE" if size_y else "SQUARE"
    ld.size = size
    if size_y:
        ld.size_y = size_y
    ld.energy = power
    ld.color = color
    o = bpy.data.objects.new(name, ld)
    scene.collection.objects.link(o)
    o.hide_render = name not in LIGHTS.split(",")
    o.location = loc
    d = Vector(target) - Vector(loc)
    o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return o

# 障子の面光源（主光源、左前・やや上）
sh = area("Shoji", (-0.42, -0.30, 0.34), (0, 0, 0.05), 0.45, 12, (1.0, 0.86, 0.66), size_y=0.65); sh.data.spread = math.radians(11)
# 縁を切る逆光（右奥、冷たい）
# 逆光は茶碗の口縁だけをかすめる。強いと手前の天板に落ちて青白く光る
rm_ = area("Rim", (0.40, 0.50, 0.30), (0, 0, 0.085), 0.10, 1.6, (0.62, 0.74, 0.90)); rm_.data.spread = math.radians(5)
# 上からの弱い返し
tp = area("Top", (0.08, -0.06, 0.9), (0, 0, 0.05), 0.35, 0.4, (1.0, 0.95, 0.88)); tp.data.spread = math.radians(12)

# ---------- カウンター ----------
bpy.ops.mesh.primitive_plane_add(size=3.0, location=(0, 0.7, 0))
counter = bpy.context.active_object
counter.name = "Counter"
wood = pbr_material("Wood", os.path.join(TEX, "dark_wood"), "dark_wood", scale=1.0, tint=(0.075, 0.062, 0.050, 1), rough_mul=0.95, bump=0.5)
counter.data.materials.append(wood)

# 奥の壁（土壁、ほぼ闇）
bpy.ops.mesh.primitive_plane_add(size=6.0, location=(0, 2.2, 1.0), rotation=(math.radians(90), 0, 0))
wall = bpy.context.active_object
wall.name = "Wall"
plaster = pbr_material("Plaster", os.path.join(TEX, "clay_plaster"), "clay_plaster", scale=0.6, tint=(0.35, 0.33, 0.30, 1), rough_mul=1.0, bump=0.4)
wall.data.materials.append(plaster)

# ---------- 茶碗（黒楽） ----------
BOWL_PROFILE = [  # (r, z) 外→口→内→底。楽茶碗の筒型。壁厚 5mm、高台つき
    (0.000, 0.000), (0.020, 0.000), (0.023, 0.004), (0.025, 0.010),
    (0.036, 0.017), (0.047, 0.030), (0.054, 0.048), (0.0575, 0.064),
    (0.0590, 0.076), (0.0582, 0.084), (0.0535, 0.0848),
    (0.0512, 0.0790), (0.0510, 0.0700), (0.0490, 0.0520), (0.0430, 0.0340),
    (0.0320, 0.0200), (0.0160, 0.0120), (0.0000, 0.0110),
]
INNER = [(0.011, 0.0), (0.012, 0.016), (0.020, 0.032), (0.034, 0.043), (0.052, 0.049), (0.070, 0.051), (0.080, 0.052)]
def inner_radius_at(z):
    if z <= INNER[0][0]:
        return INNER[0][1]
    for i in range(1, len(INNER)):
        z0, r0 = INNER[i - 1]; z1, r1 = INNER[i]
        if z <= z1:
            return r0 + (z - z0) / (z1 - z0) * (r1 - r0)
    return INNER[-1][1]

def lathe(name, profile, segments=128, wobble=None):
    bm = bmesh.new()
    rows = []
    for (r, z) in profile:
        row = []
        for i in range(segments):
            a = 2 * math.pi * i / segments
            rr, zz = r, z
            if wobble and r > 1e-6:
                w = wobble(a, z)
                rr = r * (1 + w)
                zz = z + w * 0.06
            row.append(bm.verts.new((rr * math.cos(a), rr * math.sin(a), zz)))
        rows.append(row)
    for j in range(len(rows) - 1):
        for i in range(segments):
            a, b = rows[j][i], rows[j][(i + 1) % segments]
            c, d = rows[j + 1][(i + 1) % segments], rows[j + 1][i]
            try:
                bm.faces.new((a, b, c, d))
            except ValueError:
                pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return me

def bowl_wobble(a, z):
    # 手びねりの歪み。口縁は山道（高さも波打つ）
    return (math.sin(a * 3 + 0.7) * 0.040 + math.sin(a * 5 - 1.9) * 0.022
            + math.sin(a * 8 + 2.4 + z * 40) * 0.012 + math.sin(a * 13 + z * 60) * 0.006) * (0.3 + z * 8)

bowl = add_obj("Bowl", lathe("BowlMesh", BOWL_PROFILE, 160, bowl_wobble))
smooth(bowl)
sub = bowl.modifiers.new("Subsurf", "SUBSURF")
sub.levels = sub.render_levels = 2

# 黒楽の釉薬: 黒地に赤茶と青の照り、粗さのムラ、貫入
m, nt, bsdf, out = new_material("Raku")
coord = nt.nodes.new("ShaderNodeTexCoord")
noise1 = nt.nodes.new("ShaderNodeTexNoise"); noise1.inputs["Scale"].default_value = 140; noise1.inputs["Detail"].default_value = 7; noise1.inputs["Roughness"].default_value = 0.7
noise2 = nt.nodes.new("ShaderNodeTexNoise"); noise2.inputs["Scale"].default_value = 14;  noise2.inputs["Detail"].default_value = 4
noise3 = nt.nodes.new("ShaderNodeTexNoise"); noise3.inputs["Scale"].default_value = 28;  noise3.inputs["Detail"].default_value = 2
nt.links.new(coord.outputs["Object"], noise1.inputs["Vector"])
nt.links.new(coord.outputs["Object"], noise2.inputs["Vector"])
nt.links.new(coord.outputs["Object"], noise3.inputs["Vector"])
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[0].color = (0.006, 0.005, 0.005, 1)
ramp.color_ramp.elements[1].position = 0.80; ramp.color_ramp.elements[1].color = (0.045, 0.026, 0.018, 1)
nt.links.new(noise2.outputs["Fac"], ramp.inputs["Fac"])
kase = nt.nodes.new("ShaderNodeTexNoise"); kase.inputs["Scale"].default_value = 5; kase.inputs["Detail"].default_value = 5; kase.inputs["Roughness"].default_value = 0.65
nt.links.new(coord.outputs["Object"], kase.inputs["Vector"])
kr = nt.nodes.new("ShaderNodeValToRGB")
kr.color_ramp.elements[0].position = 0.56; kr.color_ramp.elements[0].color = (0, 0, 0, 1)
kr.color_ramp.elements[1].position = 0.70; kr.color_ramp.elements[1].color = (0.16, 0.07, 0.035, 1)
nt.links.new(kase.outputs["Fac"], kr.inputs["Fac"])
kmix = nt.nodes.new("ShaderNodeMix"); kmix.data_type = "RGBA"; kmix.blend_type = "ADD"; kmix.inputs["Factor"].default_value = 1.0
nt.links.new(ramp.outputs["Color"], kmix.inputs[6]); nt.links.new(kr.outputs["Color"], kmix.inputs[7])
nt.links.new(kmix.outputs[2], bsdf.inputs["Base Color"])
rr = nt.nodes.new("ShaderNodeMapRange"); rr.inputs["From Min"].default_value = 0.3; rr.inputs["From Max"].default_value = 0.7
rr.inputs["To Min"].default_value = 0.42; rr.inputs["To Max"].default_value = 0.80
nt.links.new(noise2.outputs["Fac"], rr.inputs["Value"])
nt.links.new(rr.outputs["Result"], bsdf.inputs["Roughness"])
bump0 = nt.nodes.new("ShaderNodeBump"); bump0.inputs["Strength"].default_value = 0.35; bump0.inputs["Distance"].default_value = 0.004
nt.links.new(noise3.outputs["Fac"], bump0.inputs["Height"])
bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.25; bump.inputs["Distance"].default_value = 0.0008
nt.links.new(noise1.outputs["Fac"], bump.inputs["Height"])
nt.links.new(bump0.outputs["Normal"], bump.inputs["Normal"])
nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
set_input(bsdf, "Coat Weight", 0.22)
cr2 = nt.nodes.new("ShaderNodeMapRange"); cr2.inputs["To Min"].default_value = 0.20; cr2.inputs["To Max"].default_value = 0.65
nt.links.new(noise2.outputs["Fac"], cr2.inputs["Value"])
if "Coat Roughness" in bsdf.inputs: nt.links.new(cr2.outputs["Result"], bsdf.inputs["Coat Roughness"])
set_input(bsdf, "Specular IOR Level", 0.5)
bowl.data.materials.append(m)

# ---------- 抹茶（液面と泡） ----------
LIQ_Z = 0.046
if WHISK > 0.01:
    foam_r = inner_radius_at(LIQ_Z + 0.004) + 0.0012
    bpy.ops.mesh.primitive_circle_add(vertices=128, radius=1.0, fill_type="TRIFAN", location=(0, 0, 0))
    foam = bpy.context.active_object
    foam.name = "Foam"
    # ゆるいドーム
    bm = bmesh.new(); bm.from_mesh(foam.data)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges, cuts=6, use_grid_fill=True)
    for v in bm.verts:
        d = math.hypot(v.co.x, v.co.y)
        v.co.z = (1 - d * d) * 0.055 + random.uniform(-0.004, 0.004) * (1 - d)
    bm.to_mesh(foam.data); bm.free()
    foam.scale = (foam_r, foam_r, foam_r)
    foam.location = (0, 0, LIQ_Z + 0.0015)
    smooth(foam)
    sub = foam.modifiers.new("Subsurf", "SUBSURF"); sub.levels = sub.render_levels = 3

    m, nt, bsdf, out = new_material("Foam")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    # 泡: 2スケールのボロノイを泡の断面（球冠）に変換して凹凸に
    def bubbles(scale, seed_off):
        vor = nt.nodes.new("ShaderNodeTexVoronoi")
        vor.inputs["Scale"].default_value = scale
        vor.inputs["Randomness"].default_value = 0.9
        nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])
        # 1 - d^2 → sqrt でドーム
        sq = nt.nodes.new("ShaderNodeMath"); sq.operation = "MULTIPLY"
        nt.links.new(vor.outputs["Distance"], sq.inputs[0]); nt.links.new(vor.outputs["Distance"], sq.inputs[1])
        k = nt.nodes.new("ShaderNodeMath"); k.operation = "MULTIPLY"; k.inputs[1].default_value = 2.6
        nt.links.new(sq.outputs[0], k.inputs[0])
        inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
        nt.links.new(k.outputs[0], inv.inputs[1])
        cl = nt.nodes.new("ShaderNodeMath"); cl.operation = "MAXIMUM"; cl.inputs[1].default_value = 0.0
        nt.links.new(inv.outputs[0], cl.inputs[0])
        sq2 = nt.nodes.new("ShaderNodeMath"); sq2.operation = "SQRT"
        nt.links.new(cl.outputs[0], sq2.inputs[0])
        return sq2
    b1 = bubbles(650, 0)
    b2 = bubbles(1900, 1)
    addn = nt.nodes.new("ShaderNodeMath"); addn.operation = "MULTIPLY_ADD"; addn.inputs[1].default_value = 0.45
    nt.links.new(b2.outputs[0], addn.inputs[0]); nt.links.new(b1.outputs[0], addn.inputs[2])
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.55; bump.inputs["Distance"].default_value = 0.0012
    nt.links.new(addn.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    # 色: 中心はきめ細かく明るい黄緑、ふちはやや濃い
    grad = nt.nodes.new("ShaderNodeTexNoise"); grad.inputs["Scale"].default_value = 25; grad.inputs["Detail"].default_value = 3
    nt.links.new(coord.outputs["Object"], grad.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.3; cr.color_ramp.elements[0].color = (0.11, 0.23, 0.035, 1)
    cr.color_ramp.elements[1].position = 0.7; cr.color_ramp.elements[1].color = (0.23, 0.38, 0.075, 1)
    nt.links.new(grad.outputs["Fac"], cr.inputs["Fac"])
    nt.links.new(cr.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.28
    set_input(bsdf, "Subsurface Weight", 0.10)
    set_input(bsdf, "Subsurface Radius", (0.004, 0.006, 0.002))
    set_input(bsdf, "Subsurface Scale", 0.01)
    set_input(bsdf, "Coat Weight", 0.5); set_input(bsdf, "Coat Roughness", 0.2)
    set_input(bsdf, "Sheen Weight", 0.1)
    foam.data.materials.append(m)

    # 泡の粒: 面の上に小さな球を数千個（ジオメトリノード）。オフラインなので密度を上げられる
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0)
    proto = bpy.context.active_object; proto.name = "BubbleProto"
    proto.data.materials.append(m)
    smooth(proto)
    proto.hide_render = True; proto.hide_viewport = True
    gn = foam.modifiers.new("Bubbles", "NODES")
    ng = bpy.data.node_groups.new("BubbleScatter", "GeometryNodeTree")
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    gi = ng.nodes.new("NodeGroupInput"); go = ng.nodes.new("NodeGroupOutput")
    dist = ng.nodes.new("GeometryNodeDistributePointsOnFaces")
    dist.distribute_method = "RANDOM"
    dist.inputs["Density"].default_value = 14000 / (math.pi * 1.0 * 1.0)  # 単位半径の円に約3200個（オブジェクトスケールで縮む）
    dist.inputs["Seed"].default_value = 7
    inst = ng.nodes.new("GeometryNodeInstanceOnPoints")
    info = ng.nodes.new("GeometryNodeObjectInfo"); info.inputs["Object"].default_value = proto
    rnd = ng.nodes.new("FunctionNodeRandomValue"); rnd.data_type = "FLOAT_VECTOR"
    # スケールはオブジェクト空間（foam は foam_r で縮められる）なので半径を割り戻す
    lo = 0.00015 / foam_r; hi = 0.00055 / foam_r
    rnd.inputs[0].default_value = (lo, lo, lo * 0.55)
    rnd.inputs[1].default_value = (hi, hi, hi * 0.55)
    join = ng.nodes.new("GeometryNodeJoinGeometry")
    ng.links.new(gi.outputs[0], dist.inputs["Mesh"])
    ng.links.new(dist.outputs["Points"], inst.inputs["Points"])
    ng.links.new(info.outputs["Geometry"], inst.inputs["Instance"])
    ng.links.new(rnd.outputs["Value"], inst.inputs["Scale"])
    ng.links.new(inst.outputs["Instances"], join.inputs[0])
    ng.links.new(gi.outputs[0], join.inputs[0])
    ng.links.new(join.outputs[0], go.inputs[0])
    gn.node_group = ng

# ---------- 茶筅 ----------
if WHISK > 0.01:
    chasen = bpy.data.objects.new("Chasen", None)
    scene.collection.objects.link(chasen)

    bamboo, nt, bsdf, out = new_material("Bamboo")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave"); wave.inputs["Scale"].default_value = 900; wave.inputs["Distortion"].default_value = 3
    wave.bands_direction = "Z"
    nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.2; cr.color_ramp.elements[0].color = (0.24, 0.15, 0.055, 1)
    cr.color_ramp.elements[1].position = 0.8; cr.color_ramp.elements[1].color = (0.52, 0.40, 0.19, 1)
    nt.links.new(wave.outputs["Fac"], cr.inputs["Fac"])
    nt.links.new(cr.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.45
    set_input(bsdf, "Coat Weight", 0.3); set_input(bsdf, "Coat Roughness", 0.25)
    set_input(bsdf, "Subsurface Weight", 0.15); set_input(bsdf, "Subsurface Radius", (0.003, 0.002, 0.001)); set_input(bsdf, "Subsurface Scale", 0.01)

    # 柄
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.0090, depth=0.078, location=(0, 0, 0.114 + 0.039))
    handle = bpy.context.active_object; handle.name = "Handle"
    smooth(handle)
    bv = handle.modifiers.new("Bevel", "BEVEL"); bv.width = 0.0012; bv.segments = 4
    handle.data.materials.append(bamboo)
    handle.parent = chasen
    # 節
    bpy.ops.mesh.primitive_torus_add(major_radius=0.0092, minor_radius=0.0009, location=(0, 0, 0.176), major_segments=48, minor_segments=10)
    node_ = bpy.context.active_object; node_.name = "Node"; smooth(node_)
    node_.data.materials.append(bamboo); node_.parent = chasen
    # 黒糸
    thread, tn, tb, _ = new_material("Thread")
    tb.inputs["Base Color"].default_value = (0.02, 0.02, 0.025, 1); tb.inputs["Roughness"].default_value = 0.75
    bpy.ops.mesh.primitive_torus_add(major_radius=0.0088, minor_radius=0.0013, location=(0, 0, 0.1155), major_segments=48, minor_segments=10)
    th = bpy.context.active_object; th.name = "Thread"; smooth(th)
    th.data.materials.append(thread); th.parent = chasen

    # 穂: ポリラインの束をベベルで管にする
    OUTER = [(0.0085, 0.1140), (0.0200, 0.0985), (0.0300, 0.0785), (0.0336, 0.0600), (0.0327, 0.0498), (0.0292, 0.0448), (0.0262, 0.0430)]
    INNER_T = [(0.0060, 0.1140), (0.0135, 0.1010), (0.0188, 0.0860), (0.0202, 0.0730), (0.0172, 0.0648), (0.0150, 0.0620)]
    def tines(name, prof, count, radius, jitter):
        cu = bpy.data.curves.new(name, "CURVE")
        cu.dimensions = "3D"
        cu.bevel_depth = radius
        cu.bevel_resolution = 4
        cu.resolution_u = 12
        cu.use_fill_caps = True
        for i in range(count):
            a = 2 * math.pi * i / count + random.uniform(-0.01, 0.01)
            s = 1 + random.uniform(-jitter, jitter)
            bend = random.uniform(-0.035, 0.035)
            sp = cu.splines.new("NURBS")
            sp.points.add(len(prof) - 1)
            for k, (r, z) in enumerate(prof):
                rr = r * s
                # 先端ほど細く
                rad = 1.0 - 0.45 * (k / (len(prof) - 1))
                ak = a + bend * (k / (len(prof) - 1)) ** 2
                sp.points[k].co = (rr * math.cos(ak), rr * math.sin(ak), z, 1.0)
                sp.points[k].radius = rad
            sp.use_endpoint_u = True
            sp.order_u = 3
        o = bpy.data.objects.new(name, cu)
        scene.collection.objects.link(o)
        o.data.materials.append(bamboo)
        o.parent = chasen
        return o
    tines("OuterTines", OUTER, 72, 0.00040, 0.06)
    tines("InnerTines", INNER_T, 24, 0.00034, 0.04)

    # 点てている最中の姿勢（前後に振っている途中、少し傾く）
    chasen.location = (0.010, 0.008, 0.004)
    chasen.rotation_euler = Euler((math.radians(-14.0), math.radians(-7.0), math.radians(20)), "XYZ")

# ---------- カメラ ----------
cam_d = bpy.data.cameras.new("Cam")
cam = bpy.data.objects.new("Cam", cam_d)
scene.collection.objects.link(cam)
scene.camera = cam
cam_d.sensor_width = 36
cam_d.lens = 60
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = 2.8
cam_d.dof.focus_distance = 0.30
if POSE == "cut04":
    cam.location = (0.07, -0.26, 0.26)
    look = Vector((0.0, 0.0, 0.055))
else:
    cam.location = (0.10, -1.30, 0.42)
    look = Vector((0.0, 0.2, 0.14))
cam.rotation_euler = (look - cam.location).to_track_quat("-Z", "Y").to_euler()
cam_d.dof.focus_distance = (look - cam.location).length

bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
