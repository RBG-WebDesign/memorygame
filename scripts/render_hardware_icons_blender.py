"""
Render Samsung-style 3D hardware icons with transparent backgrounds.

Usage:
  "C:\\Program Files\\Blender Foundation\\Blender 4.1\\blender.exe" --background --python scripts/render_hardware_icons_blender.py -- --output-dir src/assets/icons3d
"""

import argparse
import math
import os
import random
import sys

import bpy
from mathutils import Vector


ICON_IDS = [
    "ram-module",
    "ssd-drive",
    "cpu-chip",
    "gpu-card",
    "motherboard",
    "cooling-fan",
    "usb-drive",
    "hard-drive",
    "floppy-disk",
    "cd",
    "hdmi-cable",
    "circuit-board",
    "binary-pattern",
    "samsung-laptop-silhouette",
    "monitor-silhouette",
    "memory-chip",
]


def parse_args() -> argparse.Namespace:
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []

    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="src/assets/icons3d")
    parser.add_argument("--size", type=int, default=1024)
    parser.add_argument("--samples", type=int, default=96)
    parser.add_argument("--seed", type=int, default=7)
    return parser.parse_args(argv)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for collection in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def set_principled_input(node: bpy.types.ShaderNodeBsdfPrincipled, key: str, value) -> None:
    socket = node.inputs.get(key)
    if socket is not None:
        socket.default_value = value


def create_materials() -> dict[str, bpy.types.Material]:
    mats: dict[str, bpy.types.Material] = {}

    def make_mat(
        name: str,
        base=(0.5, 0.5, 0.5, 1.0),
        metallic=0.0,
        roughness=0.45,
        specular=0.5,
        clearcoat=0.0,
        transmission=0.0,
        emission=(0.0, 0.0, 0.0, 1.0),
        emission_strength=0.0,
        alpha=1.0,
    ) -> bpy.types.Material:
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        assert bsdf is not None
        set_principled_input(bsdf, "Base Color", base)
        set_principled_input(bsdf, "Metallic", metallic)
        set_principled_input(bsdf, "Roughness", roughness)
        set_principled_input(bsdf, "Specular IOR Level", specular)
        set_principled_input(bsdf, "Clearcoat", clearcoat)
        set_principled_input(bsdf, "Transmission Weight", transmission)
        set_principled_input(bsdf, "Emission Color", emission)
        set_principled_input(bsdf, "Emission Strength", emission_strength)
        set_principled_input(bsdf, "Alpha", alpha)
        if alpha < 1.0:
            mat.blend_method = "BLEND"
            mat.shadow_method = "HASHED"
        return mat

    mats["metal_silver"] = make_mat(
        "M_MetalSilver",
        base=(0.75, 0.82, 0.9, 1.0),
        metallic=1.0,
        roughness=0.18,
        specular=0.62,
        clearcoat=0.36,
    )
    mats["metal_dark"] = make_mat(
        "M_MetalDark",
        base=(0.18, 0.24, 0.34, 1.0),
        metallic=0.9,
        roughness=0.3,
        specular=0.56,
        clearcoat=0.18,
    )
    mats["graphite"] = make_mat(
        "M_Graphite",
        base=(0.08, 0.12, 0.18, 1.0),
        metallic=0.35,
        roughness=0.42,
        specular=0.52,
    )
    mats["plastic_black"] = make_mat(
        "M_PlasticBlack",
        base=(0.03, 0.05, 0.08, 1.0),
        metallic=0.02,
        roughness=0.35,
        specular=0.58,
    )
    mats["pcb"] = make_mat(
        "M_PCB",
        base=(0.03, 0.22, 0.2, 1.0),
        metallic=0.1,
        roughness=0.5,
        specular=0.45,
    )
    mats["chip_blue"] = make_mat(
        "M_ChipBlue",
        base=(0.17, 0.46, 0.72, 1.0),
        metallic=0.15,
        roughness=0.28,
        specular=0.6,
    )
    mats["gold"] = make_mat(
        "M_Gold",
        base=(0.9, 0.68, 0.25, 1.0),
        metallic=1.0,
        roughness=0.25,
        specular=0.6,
    )
    mats["glass_screen"] = make_mat(
        "M_GlassScreen",
        base=(0.06, 0.14, 0.3, 1.0),
        metallic=0.0,
        roughness=0.04,
        specular=0.8,
        clearcoat=0.75,
        transmission=0.08,
    )
    mats["emission_cyan"] = make_mat(
        "M_EmissionCyan",
        base=(0.1, 0.6, 0.95, 1.0),
        metallic=0.0,
        roughness=0.1,
        emission=(0.36, 0.92, 1.0, 1.0),
        emission_strength=4.0,
    )
    mats["emission_soft"] = make_mat(
        "M_EmissionSoft",
        base=(0.1, 0.5, 0.9, 1.0),
        metallic=0.0,
        roughness=0.2,
        emission=(0.4, 0.8, 1.0, 1.0),
        emission_strength=1.4,
        alpha=0.7,
    )
    return mats


def add_bevel(obj: bpy.types.Object, width: float = 0.03, segments: int = 3) -> None:
    mod = obj.modifiers.new(name="Bevel", type="BEVEL")
    mod.limit_method = "ANGLE"
    mod.width = width
    mod.segments = segments
    mod.angle_limit = math.radians(30)


def set_smooth(obj: bpy.types.Object) -> None:
    if obj.type == "MESH":
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.shade_smooth()


def set_material(obj: bpy.types.Object, mat: bpy.types.Material) -> None:
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def cube(
    loc=(0, 0, 0),
    scale=(1, 1, 1),
    rot=(0, 0, 0),
    mat: bpy.types.Material | None = None,
    bevel=0.02,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.scale = scale
    if bevel > 0:
        add_bevel(obj, width=bevel)
    if mat:
        set_material(obj, mat)
    return obj


def cylinder(
    radius=1.0,
    depth=0.2,
    loc=(0, 0, 0),
    rot=(0, 0, 0),
    mat: bpy.types.Material | None = None,
    bevel=0.01,
    vertices=72,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rot
    )
    obj = bpy.context.active_object
    if bevel > 0:
        add_bevel(obj, width=bevel)
    set_smooth(obj)
    if mat:
        set_material(obj, mat)
    return obj


def torus(
    major_radius=1.0,
    minor_radius=0.1,
    loc=(0, 0, 0),
    rot=(0, 0, 0),
    mat: bpy.types.Material | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_torus_add(
        location=loc,
        rotation=rot,
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=96,
        minor_segments=40,
    )
    obj = bpy.context.active_object
    set_smooth(obj)
    if mat:
        set_material(obj, mat)
    return obj


def add_text(
    text: str,
    loc=(0, 0, 0),
    rot=(math.radians(90), 0, 0),
    size=0.3,
    extrude=0.02,
    mat: bpy.types.Material | None = None,
) -> bpy.types.Object:
    bpy.ops.object.text_add(location=loc, rotation=rot)
    obj = bpy.context.active_object
    data = obj.data
    data.body = text
    data.size = size
    data.extrude = extrude
    data.align_x = "CENTER"
    data.align_y = "CENTER"
    if mat:
        set_material(obj, mat)
    return obj


def add_curve_cable(
    points: list[tuple[float, float, float]],
    bevel_depth: float,
    mat: bpy.types.Material,
) -> bpy.types.Object:
    curve_data = bpy.data.curves.new(name="CableCurve", type="CURVE")
    curve_data.dimensions = "3D"
    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for i, p in enumerate(points):
        bp = spline.bezier_points[i]
        bp.co = p
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 12
    obj = bpy.data.objects.new("Cable", curve_data)
    bpy.context.collection.objects.link(obj)
    set_material(obj, mat)
    return obj


def configure_scene(size: int, samples: int, seed: int) -> dict[str, bpy.types.Material]:
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.cycles.seed = seed
    scene.render.resolution_x = size
    scene.render.resolution_y = size
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True

    world = bpy.data.worlds.new("IconWorld")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.0, 0.0, 0.0, 1.0)
        bg.inputs[1].default_value = 0.02

    mats = create_materials()

    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 92
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    scene.collection.objects.link(cam_obj)
    cam_obj.location = (0.0, -6.25, 2.6)
    point_at(cam_obj, Vector((0.0, 0.0, 0.1)))
    scene.camera = cam_obj

    light_key = bpy.data.lights.new(name="Key", type="AREA")
    light_key.energy = 1550
    light_key.color = (0.94, 0.97, 1.0)
    light_key.size = 3.0
    key_obj = bpy.data.objects.new("Key", light_key)
    scene.collection.objects.link(key_obj)
    key_obj.location = (0.0, -3.25, 4.85)
    point_at(key_obj, Vector((0.0, 0.0, 0.2)))

    light_fill = bpy.data.lights.new(name="Fill", type="AREA")
    light_fill.energy = 320
    light_fill.color = (0.62, 0.74, 0.9)
    light_fill.size = 5.0
    fill_obj = bpy.data.objects.new("Fill", light_fill)
    scene.collection.objects.link(fill_obj)
    fill_obj.location = (-2.5, -1.8, 1.7)
    point_at(fill_obj, Vector((0.0, 0.0, 0.1)))

    light_rim = bpy.data.lights.new(name="Rim", type="AREA")
    light_rim.energy = 1280
    light_rim.color = (0.25, 0.84, 1.0)
    light_rim.size = 2.8
    rim_obj = bpy.data.objects.new("Rim", light_rim)
    scene.collection.objects.link(rim_obj)
    rim_obj.location = (0.0, 3.0, 2.3)
    point_at(rim_obj, Vector((0.0, 0.0, 0.2)))

    light_glow = bpy.data.lights.new(name="BottomGlow", type="POINT")
    light_glow.energy = 90
    light_glow.color = (0.25, 0.86, 1.0)
    glow_obj = bpy.data.objects.new("BottomGlow", light_glow)
    scene.collection.objects.link(glow_obj)
    glow_obj.location = (0.0, 0.0, -0.9)

    bpy.ops.mesh.primitive_plane_add(size=24, location=(0.0, 0.0, -1.1))
    floor = bpy.context.active_object
    floor.cycles.is_shadow_catcher = True

    glow_disk = cylinder(
        radius=1.55,
        depth=0.01,
        loc=(0.0, 0.0, -0.94),
        mat=mats["emission_soft"],
        bevel=0.0,
        vertices=96,
    )
    set_smooth(glow_disk)

    random.seed(seed)
    for _ in range(34):
        x = random.uniform(-2.9, 2.9)
        y = random.uniform(-0.2, 2.7)
        z = random.uniform(-0.3, 2.3)
        s = random.uniform(0.01, 0.03)
        particle = cylinder(
            radius=s,
            depth=s * 0.22,
            loc=(x, y, z),
            mat=mats["emission_soft"],
            bevel=0.0,
            vertices=16,
        )
        set_smooth(particle)

    return mats


def build_ram_module(m: dict[str, bpy.types.Material]) -> None:
    board = cube(loc=(0, 0, 0), scale=(1.95, 0.58, 0.13), mat=m["graphite"], bevel=0.05)
    set_smooth(board)
    for x in (-1.22, -0.42, 0.38, 1.18):
        chip = cube(loc=(x, 0.02, 0.16), scale=(0.32, 0.26, 0.06), mat=m["chip_blue"], bevel=0.02)
        set_smooth(chip)
    connector = cube(loc=(0, -0.58, -0.02), scale=(1.72, 0.05, 0.03), mat=m["gold"], bevel=0.008)
    set_smooth(connector)
    for i in range(12):
        pin = cube(
            loc=(-1.52 + i * 0.28, -0.58, -0.07),
            scale=(0.04, 0.04, 0.03),
            mat=m["gold"],
            bevel=0.005,
        )
        set_smooth(pin)


def build_ssd_drive(m: dict[str, bpy.types.Material]) -> None:
    body = cube(loc=(0, 0, 0.02), scale=(1.85, 1.02, 0.2), mat=m["metal_dark"], bevel=0.08)
    set_smooth(body)
    label = cube(loc=(0, 0, 0.23), scale=(1.45, 0.74, 0.04), mat=m["glass_screen"], bevel=0.04)
    set_smooth(label)
    for y in (-0.78, 0.78):
        for x in (-1.58, 1.58):
            screw = cylinder(radius=0.05, depth=0.02, loc=(x, y, 0.22), mat=m["metal_silver"], bevel=0.0, vertices=24)
            set_smooth(screw)
    strip = cube(loc=(0.0, -1.02, -0.01), scale=(1.28, 0.045, 0.03), mat=m["gold"], bevel=0.0)
    set_smooth(strip)


def build_cpu_chip(m: dict[str, bpy.types.Material]) -> None:
    base = cube(loc=(0, 0, 0.08), scale=(1.22, 1.22, 0.2), mat=m["metal_silver"], bevel=0.08)
    set_smooth(base)
    die = cube(loc=(0, 0, 0.29), scale=(0.68, 0.68, 0.1), mat=m["chip_blue"], bevel=0.04)
    set_smooth(die)
    for i in range(8):
        pos = -1.08 + i * 0.31
        for x, y in ((-1.32, pos), (1.32, pos), (pos, -1.32), (pos, 1.32)):
            pin = cube(loc=(x, y, 0.02), scale=(0.08, 0.05, 0.045), mat=m["gold"], bevel=0.0)
            set_smooth(pin)


def build_gpu_card(m: dict[str, bpy.types.Material]) -> None:
    card = cube(loc=(0, 0, 0), scale=(2.02, 0.66, 0.15), mat=m["graphite"], bevel=0.06)
    set_smooth(card)
    for x in (-0.72, 0.72):
        ring = cylinder(radius=0.42, depth=0.07, loc=(x, 0, 0.1), mat=m["metal_dark"], bevel=0.0, vertices=72)
        set_smooth(ring)
        core = cylinder(radius=0.11, depth=0.09, loc=(x, 0, 0.13), mat=m["chip_blue"], bevel=0.0, vertices=48)
        set_smooth(core)
        for a in range(6):
            blade = cube(
                loc=(x + math.cos(a * math.pi / 3) * 0.2, math.sin(a * math.pi / 3) * 0.2, 0.1),
                scale=(0.17, 0.05, 0.02),
                rot=(0, 0, a * math.pi / 3),
                mat=m["metal_silver"],
                bevel=0.01,
            )
            set_smooth(blade)
    bracket = cube(loc=(2.08, 0.0, 0.02), scale=(0.08, 0.48, 0.14), mat=m["metal_silver"], bevel=0.02)
    set_smooth(bracket)
    gold = cube(loc=(-0.9, -0.66, -0.02), scale=(0.72, 0.05, 0.03), mat=m["gold"], bevel=0.0)
    set_smooth(gold)


def build_motherboard(m: dict[str, bpy.types.Material]) -> None:
    board = cube(loc=(0, 0, 0), scale=(1.75, 1.75, 0.1), mat=m["pcb"], bevel=0.05)
    set_smooth(board)
    cpu = cube(loc=(-0.62, 0.62, 0.14), scale=(0.56, 0.56, 0.08), mat=m["metal_silver"], bevel=0.03)
    set_smooth(cpu)
    for y in (-0.62, -0.28, 0.06, 0.4):
        ram = cube(loc=(0.68, y, 0.14), scale=(0.62, 0.12, 0.06), mat=m["chip_blue"], bevel=0.02)
        set_smooth(ram)
    pcie = cube(loc=(-0.24, -0.78, 0.12), scale=(1.2, 0.14, 0.04), mat=m["metal_dark"], bevel=0.01)
    set_smooth(pcie)
    for p in ((-0.2, -0.1), (0.4, -0.5), (0.9, 0.9), (-1.0, 0.4)):
        cap = cylinder(radius=0.11, depth=0.18, loc=(p[0], p[1], 0.16), mat=m["metal_dark"], bevel=0.0, vertices=36)
        set_smooth(cap)


def build_cooling_fan(m: dict[str, bpy.types.Material]) -> None:
    frame = torus(major_radius=1.24, minor_radius=0.12, mat=m["graphite"])
    set_smooth(frame)
    hub = cylinder(radius=0.2, depth=0.18, mat=m["chip_blue"], bevel=0.0, vertices=48)
    set_smooth(hub)
    for i in range(7):
        angle = i * (2 * math.pi / 7)
        blade = cube(
            loc=(math.cos(angle) * 0.52, math.sin(angle) * 0.52, 0.0),
            scale=(0.45, 0.1, 0.03),
            rot=(0, 0, angle + 0.45),
            mat=m["metal_silver"],
            bevel=0.02,
        )
        set_smooth(blade)
    ring = cylinder(radius=1.33, depth=0.05, mat=m["metal_dark"], bevel=0.0, vertices=96)
    set_smooth(ring)


def build_usb_drive(m: dict[str, bpy.types.Material]) -> None:
    body = cube(loc=(0, 0, 0), scale=(0.58, 1.58, 0.22), mat=m["metal_silver"], bevel=0.08)
    set_smooth(body)
    head = cube(loc=(0, 1.58, 0), scale=(0.44, 0.38, 0.16), mat=m["graphite"], bevel=0.03)
    set_smooth(head)
    slot1 = cube(loc=(-0.11, 1.58, 0.08), scale=(0.08, 0.13, 0.02), mat=m["chip_blue"], bevel=0.0)
    slot2 = cube(loc=(0.11, 1.58, 0.08), scale=(0.08, 0.13, 0.02), mat=m["chip_blue"], bevel=0.0)
    set_smooth(slot1)
    set_smooth(slot2)
    badge = cube(loc=(0, -0.08, 0.2), scale=(0.42, 0.9, 0.03), mat=m["glass_screen"], bevel=0.02)
    set_smooth(badge)


def build_hard_drive(m: dict[str, bpy.types.Material]) -> None:
    enclosure = cube(loc=(0, 0, 0), scale=(1.68, 1.48, 0.2), mat=m["metal_silver"], bevel=0.08)
    set_smooth(enclosure)
    platter = cylinder(radius=0.85, depth=0.08, loc=(0.1, 0.0, 0.18), mat=m["metal_silver"], bevel=0.0, vertices=96)
    set_smooth(platter)
    hub = cylinder(radius=0.18, depth=0.1, loc=(0.1, 0.0, 0.21), mat=m["chip_blue"], bevel=0.0, vertices=48)
    set_smooth(hub)
    arm = cube(loc=(0.74, 0.3, 0.22), scale=(0.56, 0.06, 0.03), rot=(0, 0, -0.45), mat=m["metal_dark"], bevel=0.01)
    set_smooth(arm)
    tip = cylinder(radius=0.08, depth=0.05, loc=(0.94, 0.07, 0.23), mat=m["chip_blue"], bevel=0.0, vertices=32)
    set_smooth(tip)


def build_floppy_disk(m: dict[str, bpy.types.Material]) -> None:
    disk = cube(loc=(0, 0, 0.02), scale=(1.34, 1.34, 0.14), mat=m["graphite"], bevel=0.06)
    set_smooth(disk)
    label = cube(loc=(0, 0.38, 0.16), scale=(0.88, 0.46, 0.03), mat=m["chip_blue"], bevel=0.02)
    set_smooth(label)
    shutter = cube(loc=(0, -0.72, 0.16), scale=(0.62, 0.22, 0.03), mat=m["metal_silver"], bevel=0.01)
    set_smooth(shutter)
    corner = cube(loc=(1.15, 1.12, 0.02), scale=(0.21, 0.21, 0.15), rot=(0, 0, math.radians(45)), mat=m["graphite"], bevel=0.02)
    set_smooth(corner)


def build_cd(m: dict[str, bpy.types.Material]) -> None:
    outer = cylinder(radius=1.52, depth=0.05, mat=m["metal_silver"], bevel=0.0, vertices=144)
    set_smooth(outer)
    ring = torus(major_radius=0.82, minor_radius=0.07, mat=m["glass_screen"])
    set_smooth(ring)
    hole = cylinder(radius=0.2, depth=0.06, mat=m["graphite"], bevel=0.0, vertices=96)
    set_smooth(hole)
    highlight = torus(major_radius=1.2, minor_radius=0.02, mat=m["emission_soft"])
    set_smooth(highlight)


def build_hdmi_cable(m: dict[str, bpy.types.Material]) -> None:
    cable = add_curve_cable(
        points=[(-1.65, 0.8, -0.15), (-0.8, 0.35, -0.05), (0.65, 0.35, -0.05), (1.65, 0.85, -0.12)],
        bevel_depth=0.065,
        mat=m["chip_blue"],
    )
    cable.data.fill_mode = "FULL"
    left = cube(loc=(-1.86, 0.88, -0.12), scale=(0.26, 0.24, 0.2), mat=m["graphite"], bevel=0.03)
    right = cube(loc=(1.86, 0.92, -0.12), scale=(0.26, 0.24, 0.2), mat=m["graphite"], bevel=0.03)
    set_smooth(left)
    set_smooth(right)
    left_slot = cube(loc=(-1.86, 0.96, 0.01), scale=(0.14, 0.04, 0.04), mat=m["chip_blue"], bevel=0.0)
    right_slot = cube(loc=(1.86, 1.00, 0.01), scale=(0.14, 0.04, 0.04), mat=m["chip_blue"], bevel=0.0)
    set_smooth(left_slot)
    set_smooth(right_slot)


def build_circuit_board(m: dict[str, bpy.types.Material]) -> None:
    board = cube(loc=(0, 0, 0), scale=(1.7, 1.7, 0.11), mat=m["pcb"], bevel=0.05)
    set_smooth(board)
    traces = [
        [(-1.12, -0.54, 0.13), (-0.42, -0.54, 0.13), (-0.42, 0.08, 0.13), (0.62, 0.08, 0.13), (0.62, 0.84, 0.13)],
        [(-1.12, 0.74, 0.13), (-0.28, 0.74, 0.13), (-0.28, 0.2, 0.13), (0.86, 0.2, 0.13)],
    ]
    for line in traces:
        curve = add_curve_cable(line, bevel_depth=0.028, mat=m["chip_blue"])
        curve.data.resolution_u = 20
    for p in [(-1.12, -0.54), (-0.42, 0.08), (0.62, 0.08), (0.62, 0.84), (-1.12, 0.74), (-0.28, 0.2), (0.86, 0.2)]:
        node = cylinder(radius=0.08, depth=0.04, loc=(p[0], p[1], 0.14), mat=m["chip_blue"], bevel=0.0, vertices=28)
        set_smooth(node)


def build_binary_pattern(m: dict[str, bpy.types.Material]) -> None:
    panel = cube(loc=(0, 0, 0.02), scale=(1.7, 1.4, 0.13), mat=m["graphite"], bevel=0.07)
    set_smooth(panel)
    screen = cube(loc=(0, 0.0, 0.16), scale=(1.52, 1.22, 0.03), mat=m["glass_screen"], bevel=0.03)
    set_smooth(screen)
    rows = ["01010110", "10110001", "01101100", "11010011", "00101001"]
    for i, row in enumerate(rows):
        text = add_text(
            row,
            loc=(0.0, 0.64 - i * 0.31, 0.19),
            rot=(math.radians(90), 0, 0),
            size=0.17,
            extrude=0.006,
            mat=m["emission_cyan"],
        )
        set_smooth(text)


def build_samsung_laptop(m: dict[str, bpy.types.Material]) -> None:
    base = cube(loc=(0, 0.12, -0.52), scale=(1.86, 1.22, 0.09), mat=m["metal_silver"], bevel=0.07)
    set_smooth(base)
    keyboard = cube(loc=(0, 0.2, -0.43), scale=(1.42, 0.84, 0.02), mat=m["graphite"], bevel=0.01)
    set_smooth(keyboard)
    trackpad = cube(loc=(0, -0.5, -0.42), scale=(0.62, 0.36, 0.015), mat=m["metal_dark"], bevel=0.01)
    set_smooth(trackpad)
    lid = cube(
        loc=(0, 0.56, 0.28),
        scale=(1.62, 0.06, 1.1),
        rot=(math.radians(-18), 0, 0),
        mat=m["graphite"],
        bevel=0.05,
    )
    set_smooth(lid)
    screen = cube(
        loc=(0, 0.52, 0.34),
        scale=(1.45, 0.02, 0.95),
        rot=(math.radians(-18), 0, 0),
        mat=m["glass_screen"],
        bevel=0.02,
    )
    set_smooth(screen)
    brand = add_text(
        "SAMSUNG",
        loc=(0, 0.18, -0.26),
        rot=(math.radians(90), 0, 0),
        size=0.19,
        extrude=0.009,
        mat=m["metal_silver"],
    )
    set_smooth(brand)


def build_monitor_silhouette(m: dict[str, bpy.types.Material]) -> None:
    frame = cube(loc=(0, 0.0, 0.25), scale=(1.68, 0.1, 1.12), mat=m["graphite"], bevel=0.08)
    set_smooth(frame)
    panel = cube(loc=(0, 0.06, 0.27), scale=(1.47, 0.03, 0.92), mat=m["glass_screen"], bevel=0.02)
    set_smooth(panel)
    stand = cube(loc=(0, -0.08, -0.9), scale=(0.2, 0.12, 0.56), mat=m["metal_silver"], bevel=0.03)
    set_smooth(stand)
    base = cube(loc=(0, 0.0, -1.2), scale=(0.78, 0.34, 0.08), mat=m["metal_silver"], bevel=0.03)
    set_smooth(base)


def build_memory_chip(m: dict[str, bpy.types.Material]) -> None:
    chip = cube(loc=(0, 0, 0.06), scale=(1.2, 1.2, 0.2), mat=m["metal_dark"], bevel=0.06)
    set_smooth(chip)
    die = cube(loc=(0, 0, 0.23), scale=(0.76, 0.76, 0.09), mat=m["chip_blue"], bevel=0.03)
    set_smooth(die)
    for i in range(8):
        p = -1.0 + i * 0.28
        for x, y in ((-1.26, p), (1.26, p), (p, -1.26), (p, 1.26)):
            pin = cube(loc=(x, y, 0.03), scale=(0.08, 0.045, 0.03), mat=m["gold"], bevel=0.0)
            set_smooth(pin)


BUILDERS = {
    "ram-module": build_ram_module,
    "ssd-drive": build_ssd_drive,
    "cpu-chip": build_cpu_chip,
    "gpu-card": build_gpu_card,
    "motherboard": build_motherboard,
    "cooling-fan": build_cooling_fan,
    "usb-drive": build_usb_drive,
    "hard-drive": build_hard_drive,
    "floppy-disk": build_floppy_disk,
    "cd": build_cd,
    "hdmi-cable": build_hdmi_cable,
    "circuit-board": build_circuit_board,
    "binary-pattern": build_binary_pattern,
    "samsung-laptop-silhouette": build_samsung_laptop,
    "monitor-silhouette": build_monitor_silhouette,
    "memory-chip": build_memory_chip,
}


def render_icon(icon_id: str, output_path: str, args: argparse.Namespace) -> None:
    clear_scene()
    materials = configure_scene(args.size, args.samples, args.seed)
    builder = BUILDERS[icon_id]
    builder(materials)
    bpy.context.scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)

    for icon_id in ICON_IDS:
        out_path = os.path.join(output_dir, f"{icon_id}.png")
        print(f"[render] {icon_id} -> {out_path}")
        render_icon(icon_id, out_path, args)

    readme_path = os.path.join(output_dir, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("# Photoreal 3D Hardware Icon Renders (Alpha PNG)\n\n")
        f.write("Generated with Blender using transparent film and consistent cinematic lighting.\n\n")
        f.write("Files:\n")
        for icon_id in ICON_IDS:
            f.write(f"- {icon_id}.png\n")


if __name__ == "__main__":
    main()
