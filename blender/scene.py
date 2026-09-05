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
scene.view_settings.exposure = 0.0
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
bg.inputs["Color"].default_value = (0.55, 0.50, 0.60, 1)
bg.inputs["Strength"].default_value = 0.06
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

# 窓の夕光（右手、青みがかったピンク）。大きく柔らかい
key = area("Shoji", (1.1, -0.45, 0.75), (0, 0, 0.04), 1.6, 48, (0.86, 0.80, 0.90), size_y=1.4)
# 天井のダウンライト（暖色、真上やや手前）
dl = bpy.data.lights.new("Down", "SPOT"); dl.energy = 26; dl.color = (1.0, 0.80, 0.58); dl.spot_size = math.radians(48); dl.spot_blend = 0.6; dl.shadow_soft_size = 0.06
dlo = bpy.data.objects.new("Top", dl); scene.collection.objects.link(dlo); dlo.location = (-0.25, -0.15, 1.35)
dlo.rotation_euler = (Vector((0, 0, 0.04)) - dlo.location).to_track_quat("-Z", "Y").to_euler()
dlo.hide_render = "Top" not in LIGHTS.split(",")
# 枯山水の壁を照らすダウンライト（壁を見せるため）
for wx in (-0.7, 0.5):
    wl = bpy.data.lights.new("WallDown", "SPOT"); wl.energy = 40; wl.color = (1.0, 0.85, 0.66); wl.spot_size = math.radians(70); wl.spot_blend = 0.8
    wlo = bpy.data.objects.new("Rim", wl); scene.collection.objects.link(wlo); wlo.location = (wx, 1.25, 2.3)
    wlo.rotation_euler = (Vector((wx, 1.6, 0.9)) - wlo.location).to_track_quat("-Z", "Y").to_euler()

# ---------- 台: 店の濃茶の木目テーブル（高台寺店の実物に合わせる） ----------
bpy.ops.mesh.primitive_plane_add(size=1.6, location=(0, 0.25, 0))
counter = bpy.context.active_object
counter.name = "Table"
table_mat = pbr_material("TableWood", os.path.join(TEX, "black_oak_veneer"), "black_oak_veneer", scale=1.4, tint=(0.40, 0.31, 0.24, 1), rough_mul=0.80, bump=0.35)
counter.data.materials.append(table_mat)
# 天板の角（面取り）
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.25, -0.02))
slab = bpy.context.active_object; slab.name = "TableSlab"; slab.scale = (1.6, 1.6, 0.036)
slab.data.materials.append(table_mat)

# 奥の壁: 枯山水（砂紋に石が3つ）。この画角ではボケて見える
bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.3, 1.6, 1.1), rotation=(math.radians(90), 0, 0))
wall = bpy.context.active_object; wall.name = "KaresansuiWall"; wall.scale = (4.0, 2.4, 1)
bpy.ops.object.transform_apply(scale=True)
km, nt, bsdf, out = new_material("Karesansui")
coord = nt.nodes.new("ShaderNodeTexCoord")
# 砂粒
sand = nt.nodes.new("ShaderNodeTexNoise"); sand.inputs["Scale"].default_value = 900; sand.inputs["Detail"].default_value = 3
nt.links.new(coord.outputs["Object"], sand.inputs["Vector"])
# 砂紋: 3つの石を中心にした同心円と、斜めの流れ
sepw = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(coord.outputs["Object"], sepw.inputs["Vector"])
def rings_around(cx, cz, scale):
    sub = nt.nodes.new("ShaderNodeVectorMath"); sub.operation = "SUBTRACT"; sub.inputs[1].default_value = (cx, cz, 0)
    nt.links.new(coord.outputs["Object"], sub.inputs[0])
    ln = nt.nodes.new("ShaderNodeVectorMath"); ln.operation = "LENGTH"; nt.links.new(sub.outputs[0], ln.inputs[0])
    w = nt.nodes.new("ShaderNodeTexWave"); w.wave_type = "RINGS"; w.rings_direction = "SPHERICAL"; w.inputs["Scale"].default_value = scale; w.inputs["Distortion"].default_value = 0.15
    nt.links.new(sub.outputs[0], w.inputs["Vector"])
    return w, ln
r1, l1 = rings_around(-0.9, 0.55, 38); r2, l2 = rings_around(0.55, 0.65, 38); r3, l3 = rings_around(-0.2, -0.45, 38)
flow = nt.nodes.new("ShaderNodeTexWave"); flow.wave_type = "BANDS"; flow.bands_direction = "DIAGONAL"; flow.inputs["Scale"].default_value = 36; flow.inputs["Distortion"].default_value = 1.2
nt.links.new(coord.outputs["Object"], flow.inputs["Vector"])
def nearest(a, b):
    m = nt.nodes.new("ShaderNodeMath"); m.operation = "MINIMUM"; nt.links.new(a, m.inputs[0]); nt.links.new(b, m.inputs[1]); return m
dmin = nearest(nearest(l1.outputs["Value"], l2.outputs["Value"]).outputs[0], l3.outputs["Value"])
# 石から 0.45m 以内は同心円、外は流れ
mask = nt.nodes.new("ShaderNodeMapRange"); mask.inputs["From Min"].default_value = 0.40; mask.inputs["From Max"].default_value = 0.50
nt.links.new(dmin.outputs[0], mask.inputs["Value"])
def pick(l, r):
    mm = nt.nodes.new("ShaderNodeMapRange"); mm.inputs["From Min"].default_value = 0.0; mm.inputs["From Max"].default_value = 0.42
    mm.inputs["To Min"].default_value = 1.0; mm.inputs["To Max"].default_value = 0.0
    nt.links.new(l, mm.inputs["Value"])
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; nt.links.new(mm.outputs["Result"], mul.inputs[0]); nt.links.new(r, mul.inputs[1]); return mul
ring_sum = nt.nodes.new("ShaderNodeMath"); ring_sum.operation = "ADD"
nt.links.new(pick(l1.outputs["Value"], r1.outputs["Fac"]).outputs[0], ring_sum.inputs[0]); nt.links.new(pick(l2.outputs["Value"], r2.outputs["Fac"]).outputs[0], ring_sum.inputs[1])
ring_sum2 = nt.nodes.new("ShaderNodeMath"); ring_sum2.operation = "ADD"
nt.links.new(ring_sum.outputs[0], ring_sum2.inputs[0]); nt.links.new(pick(l3.outputs["Value"], r3.outputs["Fac"]).outputs[0], ring_sum2.inputs[1])
pattern = nt.nodes.new("ShaderNodeMix"); pattern.data_type = "FLOAT"
nt.links.new(mask.outputs["Result"], pattern.inputs["Factor"]); nt.links.new(ring_sum2.outputs[0], pattern.inputs[2]); nt.links.new(flow.outputs["Fac"], pattern.inputs[3])
bsdf.inputs["Base Color"].default_value = (0.42, 0.40, 0.36, 1)
bsdf.inputs["Roughness"].default_value = 0.95
bk1 = nt.nodes.new("ShaderNodeBump"); bk1.inputs["Strength"].default_value = 0.55; bk1.inputs["Distance"].default_value = 0.004
nt.links.new(pattern.outputs[0], bk1.inputs["Height"])
bk2 = nt.nodes.new("ShaderNodeBump"); bk2.inputs["Strength"].default_value = 0.5; bk2.inputs["Distance"].default_value = 0.0015
nt.links.new(sand.outputs["Fac"], bk2.inputs["Height"]); nt.links.new(bk1.outputs["Normal"], bk2.inputs["Normal"])
nt.links.new(bk2.outputs["Normal"], bsdf.inputs["Normal"])
set_input(bsdf, "Specular IOR Level", 0.2)
wall.data.materials.append(km)
# 石（灰緑）
rock_mat, rn, rb, _ = new_material("Rock")
rb.inputs["Base Color"].default_value = (0.20, 0.23, 0.19, 1); rb.inputs["Roughness"].default_value = 0.9
rc = rn.nodes.new("ShaderNodeTexCoord"); rnz = rn.nodes.new("ShaderNodeTexNoise"); rnz.inputs["Scale"].default_value = 60; rnz.inputs["Detail"].default_value = 6
rn.links.new(rc.outputs["Object"], rnz.inputs["Vector"])
rbump = rn.nodes.new("ShaderNodeBump"); rbump.inputs["Strength"].default_value = 0.8; rbump.inputs["Distance"].default_value = 0.01
rn.links.new(rnz.outputs["Fac"], rbump.inputs["Height"]); rn.links.new(rbump.outputs["Normal"], rb.inputs["Normal"])
for (rx, rz, rs) in [(-0.6, 1.65, 0.22), (0.85, 1.75, 0.20), (0.1, 0.65, 0.19)]:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.0, location=(rx, 1.55, rz))
    rock = bpy.context.active_object; rock.scale = (rs, rs * 0.6, rs * 0.7)
    rock.rotation_euler = (random.uniform(0, 1), random.uniform(0, 1), random.uniform(0, 3))
    dsp = rock.modifiers.new("Disp", "DISPLACE"); tx = bpy.data.textures.new("rocktex", "CLOUDS"); tx.noise_scale = 0.35; dsp.texture = tx; dsp.strength = 0.35
    smooth(rock); rock.data.materials.append(rock_mat)
# ティールのベルベットのベンチ（壁の手前）。ボケの中の店の色
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.3, 1.38, 0.20))
bench = bpy.context.active_object; bench.scale = (3.6, 0.42, 0.40)
bv = bench.modifiers.new("Bevel", "BEVEL"); bv.width = 0.03; bv.segments = 4
velvet, vn, vb, _ = new_material("Velvet"); vb.inputs["Base Color"].default_value = (0.008, 0.085, 0.080, 1); vb.inputs["Roughness"].default_value = 0.75
set_input(vb, "Sheen Weight", 1.0); set_input(vb, "Sheen Roughness", 0.4); set_input(vb, "Sheen Tint", (0.6, 0.9, 0.85, 1))
bench.data.materials.append(velvet)
# 白い漆喰の壁（枯山水の壁の左右と天井側）
bpy.ops.mesh.primitive_plane_add(size=1.0, location=(-2.6, 1.62, 1.2), rotation=(math.radians(90), 0, 0))
w2 = bpy.context.active_object; w2.scale = (1.6, 2.6, 1)
plaster, pn, pb, _ = new_material("Plaster"); pb.inputs["Base Color"].default_value = (0.72, 0.70, 0.66, 1); pb.inputs["Roughness"].default_value = 0.9
w2.data.materials.append(plaster)
# 縦格子（濃い木）: 右奥に少しだけ、ボケの縦線として
lat_mat, ln_, lb, _ = new_material("Lattice"); lb.inputs["Base Color"].default_value = (0.045, 0.028, 0.018, 1); lb.inputs["Roughness"].default_value = 0.55
for i in range(9):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.75 + i * 0.075, 0.95, 0.9))
    sl = bpy.context.active_object; sl.scale = (0.018, 0.035, 2.2); sl.data.materials.append(lat_mat)
# 橙色のガラスのペンダントライト: 奥に3つ。ボケの光点になる
pend_mat = bpy.data.materials.new("Pendant"); pend_mat.use_nodes = True
pnt = pend_mat.node_tree; pnt.nodes.clear()
po = pnt.nodes.new("ShaderNodeOutputMaterial"); pe = pnt.nodes.new("ShaderNodeEmission")
pe.inputs["Color"].default_value = (1.0, 0.42, 0.10, 1); pe.inputs["Strength"].default_value = 60
pnt.links.new(pe.outputs["Emission"], po.inputs["Surface"])
for (px, py, pz) in [(-0.55, 1.15, 0.62), (0.05, 1.35, 0.70), (0.55, 1.05, 0.66)]:
    bpy.ops.mesh.primitive_cube_add(size=0.055, location=(px, py, pz))
    pd = bpy.context.active_object; pd.data.materials.append(pend_mat)
    bv = pd.modifiers.new("Bevel", "BEVEL"); bv.width = 0.006; bv.segments = 3

# ---------- 茶碗（黒楽） ----------
BOWL_PROFILE = [  # (r, z) 外→口→内→底。筒茶碗。壁厚 5〜6mm、高台つき
    (0.000, 0.000), (0.024, 0.000), (0.026, 0.004), (0.030, 0.009),
    (0.046, 0.016), (0.054, 0.030), (0.058, 0.050), (0.0600, 0.068),
    (0.0605, 0.080), (0.0595, 0.0835), (0.0545, 0.0838),
    (0.0525, 0.0790), (0.0520, 0.0680), (0.0500, 0.0500), (0.0440, 0.0320),
    (0.0330, 0.0190), (0.0160, 0.0120), (0.0000, 0.0110),
]
INNER = [(0.011, 0.0), (0.012, 0.016), (0.019, 0.033), (0.032, 0.044), (0.050, 0.050), (0.068, 0.052), (0.079, 0.0525)]
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
                zz = z + w * 0.004
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
    # 轆轤挽きのわずかな歪み。口縁の高さは揃える（山道にしない）
    return (math.sin(a * 2 + 0.7) * 0.010 + math.sin(a * 5 - 1.9) * 0.005
            + math.sin(a * 9 + 2.4 + z * 40) * 0.003) * (0.4 + z * 6)

bowl = add_obj("Bowl", lathe("BowlMesh", BOWL_PROFILE, 160, bowl_wobble))
smooth(bowl)
sub = bowl.modifiers.new("Subsurf", "SUBSURF")
sub.levels = sub.render_levels = 2

# 信楽風の土物。素地はマットでザラつき、長石の白い粒と鉄粉、轆轤目。下半分に灰釉の帯
m, nt, bsdf, out = new_material("Shigaraki")
coord = nt.nodes.new("ShaderNodeTexCoord")
def noise(scale, detail=4, rough=0.5):
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = detail; n.inputs["Roughness"].default_value = rough
    nt.links.new(coord.outputs["Object"], n.inputs["Vector"])
    return n
def mathn(op, a=None, b=None, v1=None):
    n = nt.nodes.new("ShaderNodeMath"); n.operation = op
    if a is not None: nt.links.new(a, n.inputs[0])
    if b is not None: nt.links.new(b, n.inputs[1])
    if v1 is not None: n.inputs[1].default_value = v1
    return n
# 素地の色ムラ（焼き締めの赤茶〜焦げ茶）
tone = noise(11, 8, 0.75)
clay = nt.nodes.new("ShaderNodeValToRGB")
clay.color_ramp.elements[0].position = 0.25; clay.color_ramp.elements[0].color = (0.012, 0.009, 0.007, 1)
clay.color_ramp.elements[1].position = 0.82; clay.color_ramp.elements[1].color = (0.13, 0.095, 0.065, 1)
e = clay.color_ramp.elements.new(0.55); e.color = (0.075, 0.045, 0.028, 1)
e = clay.color_ramp.elements.new(0.68); e.color = (0.15, 0.080, 0.040, 1)
nt.links.new(tone.outputs["Fac"], clay.inputs["Fac"])
# 焦げ（火前の黒ずみ）
scorch = noise(3, 3, 0.6)
sc = nt.nodes.new("ShaderNodeValToRGB")
sc.color_ramp.elements[0].position = 0.45; sc.color_ramp.elements[0].color = (1, 1, 1, 1)
sc.color_ramp.elements[1].position = 0.65; sc.color_ramp.elements[1].color = (0.25, 0.24, 0.24, 1)
nt.links.new(scorch.outputs["Fac"], sc.inputs["Fac"])
mul = nt.nodes.new("ShaderNodeMix"); mul.data_type = "RGBA"; mul.blend_type = "MULTIPLY"; mul.inputs["Factor"].default_value = 1.0
nt.links.new(clay.outputs["Color"], mul.inputs[6]); nt.links.new(sc.outputs["Color"], mul.inputs[7])
# 長石の白い粒（石はぜ）
feld = nt.nodes.new("ShaderNodeTexVoronoi"); feld.inputs["Scale"].default_value = 190; feld.inputs["Randomness"].default_value = 1.0
nt.links.new(coord.outputs["Object"], feld.inputs["Vector"])
feld_mask = mathn("LESS_THAN", feld.outputs["Distance"], v1=0.11)
feld_gate = noise(40, 2); fg = mathn("GREATER_THAN", feld_gate.outputs["Fac"], v1=0.63)
feld_on = mathn("MULTIPLY", feld_mask.outputs[0], fg.outputs[0])
# 鉄粉の黒い点
iron = nt.nodes.new("ShaderNodeTexVoronoi"); iron.inputs["Scale"].default_value = 420; iron.inputs["Randomness"].default_value = 1.0
nt.links.new(coord.outputs["Object"], iron.inputs["Vector"])
iron_mask = mathn("LESS_THAN", iron.outputs["Distance"], v1=0.07)
iron_gate = noise(25, 2); ig = mathn("GREATER_THAN", iron_gate.outputs["Fac"], v1=0.50)
iron_on = mathn("MULTIPLY", iron_mask.outputs[0], ig.outputs[0])
mix_f = nt.nodes.new("ShaderNodeMix"); mix_f.data_type = "RGBA"; mix_f.inputs[7].default_value = (0.30, 0.28, 0.25, 1)
nt.links.new(feld_on.outputs[0], mix_f.inputs["Factor"]); nt.links.new(mul.outputs[2], mix_f.inputs[6])
mix_i = nt.nodes.new("ShaderNodeMix"); mix_i.data_type = "RGBA"; mix_i.inputs[7].default_value = (0.020, 0.015, 0.012, 1)
nt.links.new(iron_on.outputs[0], mix_i.inputs["Factor"]); nt.links.new(mix_f.outputs[2], mix_i.inputs[6])
# 灰釉の帯: 下半分〜中程、縁は流れて滲む
sep = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(coord.outputs["Object"], sep.inputs["Vector"])
warp = noise(6, 4, 0.6)
drip_map = nt.nodes.new("ShaderNodeMapping"); drip_map.inputs["Scale"].default_value = (14, 14, 2.5)
nt.links.new(coord.outputs["Object"], drip_map.inputs["Vector"])
drip = nt.nodes.new("ShaderNodeTexNoise"); drip.inputs["Scale"].default_value = 1.0; drip.inputs["Detail"].default_value = 3
nt.links.new(drip_map.outputs["Vector"], drip.inputs["Vector"])
dsub = mathn("SUBTRACT", drip.outputs["Fac"], v1=0.5)
dmix = mathn("MULTIPLY_ADD", dsub.outputs[0], v1=0.025)
wsub = mathn("SUBTRACT", warp.outputs["Fac"], v1=0.5)
wmul = mathn("MULTIPLY", wsub.outputs[0], v1=0.030)
nt.links.new(wmul.outputs[0], dmix.inputs[2])
wz = mathn("ADD", dmix.outputs[0])
nt.links.new(sep.outputs["Z"], wz.inputs[2])
band = nt.nodes.new("ShaderNodeMapRange"); band.inputs["From Min"].default_value = 0.046; band.inputs["From Max"].default_value = 0.058
band.inputs["To Min"].default_value = 1.0; band.inputs["To Max"].default_value = 0.0
nt.links.new(wz.outputs[0], band.inputs["Value"])
low = nt.nodes.new("ShaderNodeMapRange"); low.inputs["From Min"].default_value = 0.008; low.inputs["From Max"].default_value = 0.018
nt.links.new(sep.outputs["Z"], low.inputs["Value"])
glaze_mask = mathn("MULTIPLY", band.outputs["Result"], low.outputs["Result"])
gtone = noise(20, 5, 0.6)
gcol = nt.nodes.new("ShaderNodeValToRGB")
gcol.color_ramp.elements[0].position = 0.35; gcol.color_ramp.elements[0].color = (0.13, 0.145, 0.12, 1)
gcol.color_ramp.elements[1].position = 0.70; gcol.color_ramp.elements[1].color = (0.34, 0.35, 0.30, 1)
nt.links.new(gtone.outputs["Fac"], gcol.inputs["Fac"])
final = nt.nodes.new("ShaderNodeMix"); final.data_type = "RGBA"
nt.links.new(glaze_mask.outputs[0], final.inputs["Factor"]); nt.links.new(mix_i.outputs[2], final.inputs[6]); nt.links.new(gcol.outputs["Color"], final.inputs[7])
nt.links.new(final.outputs[2], bsdf.inputs["Base Color"])
# 粗さ: 素地 0.85〜0.95、釉 0.30〜0.45
r_clay = nt.nodes.new("ShaderNodeMapRange"); r_clay.inputs["To Min"].default_value = 0.82; r_clay.inputs["To Max"].default_value = 0.96
nt.links.new(tone.outputs["Fac"], r_clay.inputs["Value"])
r_gl = nt.nodes.new("ShaderNodeMapRange"); r_gl.inputs["To Min"].default_value = 0.28; r_gl.inputs["To Max"].default_value = 0.48
nt.links.new(gtone.outputs["Fac"], r_gl.inputs["Value"])
r_mix = nt.nodes.new("ShaderNodeMix"); r_mix.data_type = "FLOAT"
nt.links.new(glaze_mask.outputs[0], r_mix.inputs["Factor"]); nt.links.new(r_clay.outputs["Result"], r_mix.inputs[2]); nt.links.new(r_gl.outputs["Result"], r_mix.inputs[3])
nt.links.new(r_mix.outputs[0], bsdf.inputs["Roughness"])
# 凹凸: 轆轤目（横の筋）＋粗い粒＋細かいザラつき
rings = nt.nodes.new("ShaderNodeTexWave"); rings.inputs["Scale"].default_value = 90; rings.inputs["Distortion"].default_value = 3.0; rings.inputs["Detail"].default_value = 3
rings.wave_type = "BANDS"; rings.bands_direction = "Z"
nt.links.new(coord.outputs["Object"], rings.inputs["Vector"])
g1 = noise(90, 5, 0.7); g2 = noise(900, 3, 0.6)
bA = nt.nodes.new("ShaderNodeBump"); bA.inputs["Strength"].default_value = 0.10; bA.inputs["Distance"].default_value = 0.0010
nt.links.new(rings.outputs["Fac"], bA.inputs["Height"])
bB = nt.nodes.new("ShaderNodeBump"); bB.inputs["Strength"].default_value = 0.7; bB.inputs["Distance"].default_value = 0.0016
nt.links.new(g1.outputs["Fac"], bB.inputs["Height"]); nt.links.new(bA.outputs["Normal"], bB.inputs["Normal"])
bC = nt.nodes.new("ShaderNodeBump"); bC.inputs["Strength"].default_value = 0.45; bC.inputs["Distance"].default_value = 0.00025
nt.links.new(g2.outputs["Fac"], bC.inputs["Height"]); nt.links.new(bB.outputs["Normal"], bC.inputs["Normal"])
# 長石の粒は盛り上がる
bD = nt.nodes.new("ShaderNodeBump"); bD.inputs["Strength"].default_value = 0.6; bD.inputs["Distance"].default_value = 0.0006
nt.links.new(feld_on.outputs[0], bD.inputs["Height"]); nt.links.new(bC.outputs["Normal"], bD.inputs["Normal"])
nt.links.new(bD.outputs["Normal"], bsdf.inputs["Normal"])
set_input(bsdf, "Specular IOR Level", 0.35)
coatw = mathn("MULTIPLY", glaze_mask.outputs[0], v1=0.35)
if "Coat Weight" in bsdf.inputs: nt.links.new(coatw.outputs[0], bsdf.inputs["Coat Weight"])
set_input(bsdf, "Coat Roughness", 0.3)
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
    foam.location = (0, 0, LIQ_Z - 0.0005)
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
            thick = random.uniform(0.85, 1.15)
            sp = cu.splines.new("NURBS")
            sp.points.add(len(prof) - 1)
            for k, (r, z) in enumerate(prof):
                rr = r * s
                # 先端ほど細く
                rad = (1.0 - 0.45 * (k / (len(prof) - 1))) * thick
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
cam_d.lens = 58
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = 2.8
cam_d.dof.focus_distance = 0.30
if POSE == "cut04":
    cam.location = (0.09, -0.33, 0.27)
    look = Vector((0.0, 0.0, 0.058))
else:
    cam.location = (0.10, -1.40, 0.62)
    look = Vector((0.1, 0.6, 0.55))
cam.rotation_euler = (look - cam.location).to_track_quat("-Z", "Y").to_euler()
cam_d.dof.focus_distance = (look - cam.location).length

bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
