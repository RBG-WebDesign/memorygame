param(
  [string]$OutputDir = 'src/assets/icons3d'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $OutputDir)) {
  New-Item -Path $OutputDir -ItemType Directory | Out-Null
}

$icons = @(
  @{ Id = 'ram-module'; Title = 'RAM Module' },
  @{ Id = 'ssd-drive'; Title = 'SSD Drive' },
  @{ Id = 'cpu-chip'; Title = 'CPU Chip' },
  @{ Id = 'gpu-card'; Title = 'GPU Card' },
  @{ Id = 'motherboard'; Title = 'Motherboard' },
  @{ Id = 'cooling-fan'; Title = 'Cooling Fan' },
  @{ Id = 'usb-drive'; Title = 'USB Flash Drive' },
  @{ Id = 'hard-drive'; Title = 'Hard Disk Drive' },
  @{ Id = 'floppy-disk'; Title = 'Floppy Disk' },
  @{ Id = 'cd'; Title = 'CD Disc' },
  @{ Id = 'hdmi-cable'; Title = 'HDMI Cable' },
  @{ Id = 'circuit-board'; Title = 'Circuit Board' },
  @{ Id = 'binary-pattern'; Title = 'Binary Pattern Panel' },
  @{ Id = 'samsung-laptop-silhouette'; Title = 'Samsung Laptop Silhouette' },
  @{ Id = 'monitor-silhouette'; Title = 'Computer Monitor Silhouette' },
  @{ Id = 'memory-chip'; Title = 'Memory Chip Module' }
)

function Get-IconBody {
  param([string]$Id)

  switch ($Id) {
    'ram-module' {
      return @'
  <g class="obj-outline">
    <rect x="-310" y="-90" width="620" height="180" rx="28" class="mat-graphite"/>
    <rect x="-270" y="-44" width="108" height="78" rx="11" class="mat-silicon"/>
    <rect x="-133" y="-44" width="108" height="78" rx="11" class="mat-silicon"/>
    <rect x="4" y="-44" width="108" height="78" rx="11" class="mat-silicon"/>
    <rect x="141" y="-44" width="108" height="78" rx="11" class="mat-silicon"/>
    <rect x="-265" y="92" width="530" height="16" rx="6" class="mat-gold"/>
    <path d="M-238 108V142M-200 108V142M-162 108V142M-124 108V142M-86 108V142M-48 108V142M-10 108V142M28 108V142M66 108V142M104 108V142M142 108V142M180 108V142M218 108V142" class="pin-lines"/>
  </g>
'@
    }
    'ssd-drive' {
      return @'
  <g class="obj-outline">
    <rect x="-290" y="-150" width="580" height="300" rx="54" class="mat-metal"/>
    <rect x="-225" y="-85" width="450" height="170" rx="26" class="mat-glass"/>
    <rect x="-210" y="-58" width="260" height="26" rx="10" class="mat-silicon"/>
    <rect x="-210" y="-16" width="390" height="22" rx="9" class="mat-silicon-soft"/>
    <rect x="-210" y="20" width="320" height="22" rx="9" class="mat-silicon-soft"/>
    <circle cx="220" cy="-92" r="12" class="screw"/>
    <circle cx="220" cy="92" r="12" class="screw"/>
  </g>
'@
    }
    'cpu-chip' {
      return @'
  <g class="obj-outline">
    <rect x="-210" y="-210" width="420" height="420" rx="68" class="mat-ceramic"/>
    <rect x="-128" y="-128" width="256" height="256" rx="38" class="mat-silicon"/>
    <path d="M-210 -106H-280M-210 -36H-280M-210 34H-280M-210 104H-280M210 -106H280M210 -36H280M210 34H280M210 104H280" class="pin-lines-thick"/>
    <path d="M-106 -210V-280M-36 -210V-280M34 -210V-280M104 -210V-280M-106 210V280M-36 210V280M34 210V280M104 210V280" class="pin-lines-thick"/>
  </g>
'@
    }
    'gpu-card' {
      return @'
  <g class="obj-outline">
    <rect x="-330" y="-108" width="660" height="216" rx="34" class="mat-graphite"/>
    <circle cx="-120" cy="0" r="76" class="fan-shell"/>
    <circle cx="-120" cy="0" r="22" class="mat-silicon"/>
    <circle cx="132" cy="0" r="76" class="fan-shell"/>
    <circle cx="132" cy="0" r="22" class="mat-silicon"/>
    <rect x="332" y="-56" width="46" height="112" rx="9" class="mat-metal-soft"/>
    <rect x="-298" y="108" width="280" height="20" rx="7" class="mat-gold"/>
  </g>
'@
    }
    'motherboard' {
      return @'
  <g class="obj-outline">
    <rect x="-280" y="-280" width="560" height="560" rx="54" class="mat-board"/>
    <rect x="-210" y="-210" width="220" height="220" rx="28" class="mat-ceramic"/>
    <rect x="44" y="-210" width="170" height="58" rx="10" class="mat-silicon-soft"/>
    <rect x="44" y="-126" width="170" height="58" rx="10" class="mat-silicon-soft"/>
    <rect x="-210" y="42" width="424" height="104" rx="16" class="mat-silicon-soft"/>
    <path d="M10 -100H44M-100 10V42M10 10H44" class="trace-lines"/>
  </g>
'@
    }
    'cooling-fan' {
      return @'
  <g class="obj-outline">
    <circle cx="0" cy="0" r="250" class="mat-graphite"/>
    <circle cx="0" cy="0" r="40" class="mat-silicon"/>
    <path d="M0 0L176 -62A170 170 0 0 1 82 152Z" class="fan-blade"/>
    <path d="M0 0L-92 176A170 170 0 0 1 -176 34Z" class="fan-blade"/>
    <path d="M0 0L-138 -126A170 170 0 0 1 80 -154Z" class="fan-blade"/>
    <circle cx="0" cy="0" r="170" class="ring-line"/>
  </g>
'@
    }
    'usb-drive' {
      return @'
  <g class="obj-outline">
    <rect x="-148" y="-228" width="296" height="456" rx="56" class="mat-metal"/>
    <rect x="-96" y="-280" width="192" height="120" rx="24" class="mat-graphite"/>
    <rect x="-60" y="-246" width="44" height="52" rx="8" class="mat-silicon"/>
    <rect x="18" y="-246" width="44" height="52" rx="8" class="mat-silicon"/>
    <rect x="-102" y="-110" width="204" height="236" rx="26" class="mat-glass"/>
  </g>
'@
    }
    'hard-drive' {
      return @'
  <g class="obj-outline">
    <rect x="-268" y="-268" width="536" height="536" rx="60" class="mat-metal"/>
    <circle cx="0" cy="0" r="176" class="disk-platter"/>
    <circle cx="0" cy="0" r="48" class="mat-silicon"/>
    <path d="M0 0L166 -102" class="arm-line"/>
    <circle cx="166" cy="-102" r="18" class="mat-silicon"/>
  </g>
'@
    }
    'floppy-disk' {
      return @'
  <g class="obj-outline">
    <path d="M-210 -280H120L210 -190V280H-210Z" class="mat-graphite"/>
    <path d="M120 -280V-190H210" class="trace-lines"/>
    <rect x="-148" y="-220" width="262" height="150" rx="16" class="mat-silicon-soft"/>
    <rect x="-114" y="92" width="228" height="126" rx="14" class="mat-glass"/>
  </g>
'@
    }
    'cd' {
      return @'
  <g class="obj-outline">
    <circle cx="0" cy="0" r="258" class="disk-shell"/>
    <circle cx="0" cy="0" r="130" class="disk-inner"/>
    <circle cx="0" cy="0" r="36" class="disk-core"/>
    <path d="M0 -258A258 258 0 0 1 258 0" class="ring-line"/>
  </g>
'@
    }
    'hdmi-cable' {
      return @'
  <g class="obj-outline">
    <path d="M-248 120C-134 36 -58 24 0 24C86 24 148 56 258 130" class="cable-line"/>
    <rect x="-332" y="28" width="132" height="132" rx="22" class="mat-graphite"/>
    <rect x="202" y="42" width="132" height="120" rx="22" class="mat-graphite"/>
    <rect x="-306" y="58" width="82" height="28" rx="9" class="mat-silicon"/>
    <rect x="228" y="66" width="82" height="24" rx="9" class="mat-silicon"/>
  </g>
'@
    }
    'circuit-board' {
      return @'
  <g class="obj-outline">
    <rect x="-280" y="-280" width="560" height="560" rx="54" class="mat-board"/>
    <path d="M-214 -118H-64V16H94V172H216" class="trace-lines"/>
    <path d="M-214 168H-88V72H66V-76H216" class="trace-lines"/>
    <circle cx="-214" cy="-118" r="14" class="mat-silicon"/>
    <circle cx="-64" cy="16" r="14" class="mat-silicon"/>
    <circle cx="94" cy="172" r="14" class="mat-silicon"/>
    <circle cx="-214" cy="168" r="14" class="mat-silicon"/>
    <circle cx="-88" cy="72" r="14" class="mat-silicon"/>
    <circle cx="66" cy="-76" r="14" class="mat-silicon"/>
    <circle cx="216" cy="172" r="14" class="mat-silicon"/>
    <circle cx="216" cy="-76" r="14" class="mat-silicon"/>
  </g>
'@
    }
    'binary-pattern' {
      return @'
  <g class="obj-outline">
    <rect x="-280" y="-280" width="560" height="560" rx="54" class="mat-graphite"/>
    <rect x="-242" y="-230" width="484" height="460" rx="24" class="mat-glass"/>
    <text x="-190" y="-114" class="binary-text">01010110</text>
    <text x="-190" y="-32" class="binary-text">10110001</text>
    <text x="-190" y="50" class="binary-text">01101100</text>
    <text x="-190" y="132" class="binary-text">11010011</text>
    <text x="-190" y="214" class="binary-text">00101001</text>
  </g>
'@
    }
    'samsung-laptop-silhouette' {
      return @'
  <g class="obj-outline">
    <rect x="-250" y="-206" width="500" height="318" rx="36" class="mat-graphite"/>
    <rect x="-308" y="136" width="616" height="66" rx="26" class="mat-metal-soft"/>
    <rect x="-184" y="-142" width="368" height="204" rx="20" class="mat-screen"/>
    <path d="M-170 -84L176 18" class="screen-streak"/>
    <path d="M-184 -44L92 62" class="screen-streak-soft"/>
    <text x="0" y="-14" class="brand-mark">SAMSUNG</text>
  </g>
'@
    }
    'monitor-silhouette' {
      return @'
  <g class="obj-outline">
    <rect x="-280" y="-234" width="560" height="376" rx="46" class="mat-graphite"/>
    <rect x="-222" y="-176" width="444" height="250" rx="26" class="mat-screen"/>
    <path d="M-204 -106L216 -6" class="screen-streak"/>
    <path d="M-196 -34L142 70" class="screen-streak-soft"/>
    <rect x="-42" y="142" width="84" height="104" rx="18" class="mat-metal-soft"/>
    <rect x="-136" y="232" width="272" height="44" rx="16" class="mat-metal-soft"/>
  </g>
'@
    }
    'memory-chip' {
      return @'
  <g class="obj-outline">
    <rect x="-214" y="-198" width="428" height="396" rx="62" class="mat-ceramic"/>
    <rect x="-138" y="-124" width="276" height="248" rx="34" class="mat-silicon"/>
    <path d="M-214 -114H-288M-214 -44H-288M-214 26H-288M-214 96H-288M214 -114H288M214 -44H288M214 26H288M214 96H288" class="pin-lines-thick"/>
    <path d="M-112 -198V-272M-38 -198V-272M36 -198V-272M110 -198V-272M-112 198V272M-38 198V272M36 198V272M110 198V272" class="pin-lines-thick"/>
  </g>
'@
    }
    default {
      throw "Unknown icon id: $Id"
    }
  }
}

$commonDefs = @'
  <defs>
    <linearGradient id="bgGradient" x1="72" y1="64" x2="952" y2="964" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#01050d"/>
      <stop offset="0.46" stop-color="#05152e"/>
      <stop offset="1" stop-color="#020a1b"/>
    </linearGradient>
    <radialGradient id="bgGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 468) rotate(90) scale(352)">
      <stop offset="0" stop-color="#28d7ff" stop-opacity="0.36"/>
      <stop offset="0.56" stop-color="#107fc6" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#0a2f67" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="floorGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 812) rotate(90) scale(108 290)">
      <stop offset="0" stop-color="#67e3ff" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#67e3ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rearRim" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 528) rotate(90) scale(182 348)">
      <stop offset="0" stop-color="#88eaff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#88eaff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="screenA" x1="230" y1="214" x2="778" y2="762" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0b234f"/>
      <stop offset="0.55" stop-color="#0d3e7a"/>
      <stop offset="1" stop-color="#081531"/>
    </linearGradient>

    <linearGradient id="rimGradient" x1="148" y1="162" x2="880" y2="884" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#94f2ff"/>
      <stop offset="0.58" stop-color="#4bc3ff"/>
      <stop offset="1" stop-color="#2f7eff"/>
    </linearGradient>

    <linearGradient id="metalA" x1="190" y1="140" x2="822" y2="846" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f9fdff"/>
      <stop offset="0.24" stop-color="#c6d8e8"/>
      <stop offset="0.58" stop-color="#7389a0"/>
      <stop offset="1" stop-color="#33465f"/>
    </linearGradient>
    <linearGradient id="metalB" x1="226" y1="194" x2="790" y2="842" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#e0e9f2"/>
      <stop offset="0.52" stop-color="#72869c"/>
      <stop offset="1" stop-color="#2d4056"/>
    </linearGradient>
    <linearGradient id="graphiteA" x1="196" y1="176" x2="792" y2="858" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5c6d80"/>
      <stop offset="0.5" stop-color="#273b53"/>
      <stop offset="1" stop-color="#101d30"/>
    </linearGradient>
    <linearGradient id="siliconA" x1="242" y1="214" x2="770" y2="790" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#9feeff"/>
      <stop offset="0.45" stop-color="#3293d8"/>
      <stop offset="1" stop-color="#1a3f84"/>
    </linearGradient>
    <linearGradient id="boardA" x1="186" y1="192" x2="822" y2="830" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0f5f6f"/>
      <stop offset="0.46" stop-color="#0d3955"/>
      <stop offset="1" stop-color="#082436"/>
    </linearGradient>
    <linearGradient id="goldA" x1="200" y1="190" x2="830" y2="860" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffe9b0"/>
      <stop offset="0.5" stop-color="#d2a447"/>
      <stop offset="1" stop-color="#7d5a20"/>
    </linearGradient>
    <linearGradient id="glassA" x1="198" y1="162" x2="810" y2="830" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#c7f4ff" stop-opacity="0.35"/>
      <stop offset="0.45" stop-color="#4ea9df" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#132e53" stop-opacity="0.46"/>
    </linearGradient>

    <filter id="objectShadow" x="-25%" y="-25%" width="150%" height="170%">
      <feDropShadow dx="0" dy="34" stdDeviation="26" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
    <filter id="softBloom" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="reflectionBlur" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="7"/>
      <feColorMatrix type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 0.45 0"/>
    </filter>
    <filter id="noiseFilm" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.028"/>
      </feComponentTransfer>
    </filter>

    <style>
      .obj-outline > * { stroke: url(#rimGradient); stroke-opacity: 0.75; stroke-width: 8; stroke-linejoin: round; stroke-linecap: round; }
      .mat-metal { fill: url(#metalA); }
      .mat-metal-soft { fill: url(#metalB); }
      .mat-graphite { fill: url(#graphiteA); }
      .mat-ceramic { fill: url(#metalB); }
      .mat-silicon { fill: url(#siliconA); }
      .mat-silicon-soft { fill: url(#siliconA); opacity: 0.68; }
      .mat-board { fill: url(#boardA); }
      .mat-gold { fill: url(#goldA); }
      .mat-glass { fill: url(#glassA); }
      .mat-screen { fill: url(#screenA); }

      .pin-lines { stroke: url(#goldA); stroke-width: 7; stroke-linecap: round; fill: none; }
      .pin-lines-thick { stroke: url(#goldA); stroke-width: 10; stroke-linecap: round; fill: none; }
      .trace-lines { stroke: url(#siliconA); stroke-width: 8; stroke-linecap: round; fill: none; }
      .ring-line { stroke: url(#siliconA); stroke-width: 8; fill: none; opacity: 0.66; }
      .fan-shell { fill: url(#graphiteA); stroke: url(#rimGradient); stroke-width: 8; }
      .fan-blade { fill: url(#siliconA); opacity: 0.76; stroke: none; }
      .disk-platter { fill: url(#metalA); stroke: url(#rimGradient); stroke-width: 8; }
      .disk-shell { fill: url(#metalA); stroke: url(#rimGradient); stroke-width: 8; }
      .disk-inner { fill: url(#glassA); stroke: url(#rimGradient); stroke-width: 6; }
      .disk-core { fill: url(#graphiteA); stroke: url(#rimGradient); stroke-width: 5; }
      .arm-line { stroke: url(#metalA); stroke-width: 12; stroke-linecap: round; fill: none; }
      .screw { fill: url(#metalA); stroke: url(#rimGradient); stroke-width: 4; }
      .cable-line { stroke: url(#siliconA); stroke-width: 16; stroke-linecap: round; fill: none; }
      .binary-text { fill: #88e7ff; font-family: 'Segoe UI', Arial, sans-serif; font-size: 58px; font-weight: 700; letter-spacing: 8px; opacity: 0.92; }
      .brand-mark { fill: #d4f0ff; font-family: 'Segoe UI', Arial, sans-serif; font-size: 34px; font-weight: 700; letter-spacing: 5px; }
      .screen-streak { stroke: #8fe6ff; stroke-width: 12; stroke-linecap: round; opacity: 0.88; filter: url(#softBloom); fill: none; }
      .screen-streak-soft { stroke: #6fb6ff; stroke-width: 6; stroke-linecap: round; opacity: 0.72; fill: none; }
    </style>
  </defs>
'@

foreach ($icon in $icons) {
  $body = Get-IconBody -Id $icon.Id

  $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="$($icon.Title)">
$commonDefs
  <rect x="0" y="0" width="1024" height="1024" fill="url(#bgGradient)"/>
  <g opacity="0.7">
    <circle cx="216" cy="198" r="2.4" fill="#7fdfff"/>
    <circle cx="292" cy="146" r="1.8" fill="#8de7ff"/>
    <circle cx="726" cy="208" r="2.2" fill="#76d9ff"/>
    <circle cx="806" cy="166" r="1.6" fill="#8de7ff"/>
    <circle cx="856" cy="258" r="1.8" fill="#6ec8ff"/>
    <circle cx="166" cy="262" r="1.6" fill="#72d8ff"/>
    <circle cx="908" cy="308" r="2.1" fill="#7ad6ff"/>
    <circle cx="108" cy="334" r="2.3" fill="#80dcff"/>
    <path d="M148 396L356 346" stroke="#4ec7ff" stroke-opacity="0.22" stroke-width="2"/>
    <path d="M668 342L888 386" stroke="#58d1ff" stroke-opacity="0.2" stroke-width="2"/>
  </g>
  <circle cx="512" cy="468" r="352" fill="url(#bgGlow)"/>
  <ellipse cx="512" cy="548" rx="352" ry="160" fill="url(#rearRim)" filter="url(#softBloom)" opacity="0.75"/>
  <path d="M126 402L890 548" stroke="#5fd4ff" stroke-width="3.5" stroke-opacity="0.16" filter="url(#softBloom)" fill="none"/>
  <path d="M180 330L816 448" stroke="#87e8ff" stroke-width="2.2" stroke-opacity="0.2" filter="url(#softBloom)" fill="none"/>

  <ellipse cx="512" cy="816" rx="308" ry="68" fill="#01040c" opacity="0.72" filter="url(#softBloom)"/>
  <ellipse cx="512" cy="808" rx="246" ry="42" fill="url(#floorGlow)" opacity="0.85" filter="url(#softBloom)"/>

  <g transform="translate(512 510) scale(1 0.92)" filter="url(#objectShadow)">
$body
  </g>
  <g transform="translate(512 842) scale(1 -0.34)" filter="url(#reflectionBlur)" opacity="0.24">
$body
  </g>

  <rect x="0" y="0" width="1024" height="1024" fill="url(#bgGlow)" opacity="0.14"/>
  <rect x="0" y="0" width="1024" height="1024" fill="#01030a" opacity="0.15"/>
  <rect x="0" y="0" width="1024" height="1024" filter="url(#noiseFilm)" opacity="0.62"/>
</svg>
"@

  Set-Content -Path (Join-Path $OutputDir "$($icon.Id).svg") -Value $svg -Encoding utf8
}

$readme = @"
# Premium 3D Samsung-Style Hardware Icon Set

All icons in this folder were generated using one shared render system:
- 1:1 composition and centered object
- Deep navy gradient background + radial cyan glow
- Soft top studio lighting + cyan rim accent
- Material palette: brushed metal, graphite, silicon, glass
- Floating shadow and subtle ambient bloom

Icons:
$((($icons | ForEach-Object { "- $($_.Id).svg" }) -join "`n"))
"@
Set-Content -Path (Join-Path $OutputDir 'README.md') -Value $readme -Encoding utf8

Write-Output "Generated $($icons.Count) premium icons in $OutputDir"
