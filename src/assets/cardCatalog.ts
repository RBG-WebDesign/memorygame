import binaryPatternPng from '@/assets/icons3d/binary-pattern.png';
import cdPng from '@/assets/icons3d/cd.png';
import circuitBoardPng from '@/assets/icons3d/circuit-board.png';
import coolingFanPng from '@/assets/icons3d/cooling-fan.png';
import cpuChipPng from '@/assets/icons3d/cpu-chip.png';
import floppyDiskPng from '@/assets/icons3d/floppy-disk.png';
import gpuCardPng from '@/assets/icons3d/gpu-card.png';
import hardDrivePng from '@/assets/icons3d/hard-drive.png';
import hdmiCablePng from '@/assets/icons3d/hdmi-cable.png';
import memoryChipPng from '@/assets/icons3d/memory-chip.png';
import monitorSilhouettePng from '@/assets/icons3d/monitor-silhouette.png';
import motherboardPng from '@/assets/icons3d/motherboard.png';
import ramModulePng from '@/assets/icons3d/ram-module.png';
import samsungLaptopSilhouettePng from '@/assets/icons3d/samsung-laptop-silhouette.png';
import ssdDrivePng from '@/assets/icons3d/ssd-drive.png';
import usbDrivePng from '@/assets/icons3d/usb-drive.png';

import ethernetPortSvg from '@/assets/cards/ethernet-port.svg';
import keyboardSvg from '@/assets/cards/keyboard.svg';
import mouseSvg from '@/assets/cards/mouse.svg';
import serverRackSvg from '@/assets/cards/server-rack.svg';

export interface CardArt {
  id: string;
  label: string;
  src: string;
}

const CARD_ART: Record<string, CardArt> = {
  'ram-module': {
    id: 'ram-module',
    label: 'RAM Module',
    src: ramModulePng,
  },
  'nvme-ssd': {
    id: 'nvme-ssd',
    label: 'NVMe SSD',
    src: ssdDrivePng,
  },
  'sata-ssd': {
    id: 'sata-ssd',
    label: 'SATA SSD',
    src: ssdDrivePng,
  },
  'cpu-chip': {
    id: 'cpu-chip',
    label: 'CPU Chip',
    src: cpuChipPng,
  },
  'gpu-card': {
    id: 'gpu-card',
    label: 'GPU Card',
    src: gpuCardPng,
  },
  motherboard: {
    id: 'motherboard',
    label: 'Motherboard',
    src: motherboardPng,
  },
  'circuit-board': {
    id: 'circuit-board',
    label: 'Circuit Board',
    src: circuitBoardPng,
  },
  'cooling-fan': {
    id: 'cooling-fan',
    label: 'Cooling Fan',
    src: coolingFanPng,
  },
  'usb-drive': {
    id: 'usb-drive',
    label: 'USB Flash Drive',
    src: usbDrivePng,
  },
  'hdmi-cable': {
    id: 'hdmi-cable',
    label: 'HDMI Cable',
    src: hdmiCablePng,
  },
  'ethernet-port': {
    id: 'ethernet-port',
    label: 'Ethernet Port',
    src: ethernetPortSvg,
  },
  monitor: {
    id: 'monitor',
    label: 'Monitor',
    src: monitorSilhouettePng,
  },
  'galaxy-book': {
    id: 'galaxy-book',
    label: 'Galaxy Laptop',
    src: samsungLaptopSilhouettePng,
  },
  'samsung-ssd': {
    id: 'samsung-ssd',
    label: 'Samsung SSD',
    src: ssdDrivePng,
  },
  'memory-stick': {
    id: 'memory-stick',
    label: 'Memory Stick',
    src: ramModulePng,
  },
  'hard-drive': {
    id: 'hard-drive',
    label: 'Hard Drive',
    src: hardDrivePng,
  },
  'floppy-disk': {
    id: 'floppy-disk',
    label: 'Floppy Disk',
    src: floppyDiskPng,
  },
  'dvd-disc': {
    id: 'dvd-disc',
    label: 'DVD Disc',
    src: cdPng,
  },
  'cd-disc': {
    id: 'cd-disc',
    label: 'CD Disc',
    src: cdPng,
  },
  'binary-core': {
    id: 'binary-core',
    label: 'Binary Core',
    src: binaryPatternPng,
  },
  microchip: {
    id: 'microchip',
    label: 'Microchip',
    src: memoryChipPng,
  },
  keyboard: {
    id: 'keyboard',
    label: 'Keyboard',
    src: keyboardSvg,
  },
  mouse: {
    id: 'mouse',
    label: 'Mouse',
    src: mouseSvg,
  },
  'server-rack': {
    id: 'server-rack',
    label: 'Server Rack',
    src: serverRackSvg,
  },
};

export const CARD_ART_IDS = Object.keys(CARD_ART);

export const getCardArt = (id: string): CardArt => {
  return CARD_ART[id] ?? {
    id,
    label: id.replace(/-/g, ' '),
    src: ramModulePng,
  };
};

