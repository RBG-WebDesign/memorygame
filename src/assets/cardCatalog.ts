import ramModulePng from '@/assets/icons3d/ram-module.png';
import ssdDrivePng from '@/assets/icons3d/ssd-drive.png';
import cpuChipPng from '@/assets/icons3d/cpu-chip.png';
import gpuCardPng from '@/assets/icons3d/gpu-card.png';
import motherboardPng from '@/assets/icons3d/motherboard.png';
import coolingFanPng from '@/assets/icons3d/cooling-fan.png';
import usbDrivePng from '@/assets/icons3d/usb-drive.png';
import hardDrivePng from '@/assets/icons3d/hard-drive.png';
import floppyDiskPng from '@/assets/icons3d/floppy-disk.png';
import cdPng from '@/assets/icons3d/cd.png';
import hdmiCablePng from '@/assets/icons3d/hdmi-cable.png';
import circuitBoardPng from '@/assets/icons3d/circuit-board.png';
import binaryPatternPng from '@/assets/icons3d/binary-pattern.png';
import samsungLaptopSilhouettePng from '@/assets/icons3d/samsung-laptop-silhouette.png';
import monitorSilhouettePng from '@/assets/icons3d/monitor-silhouette.png';
import memoryChipPng from '@/assets/icons3d/memory-chip.png';

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
  'ssd-drive': {
    id: 'ssd-drive',
    label: 'SSD Drive',
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
  cd: {
    id: 'cd',
    label: 'CD Disc',
    src: cdPng,
  },
  'binary-pattern': {
    id: 'binary-pattern',
    label: 'Binary Pattern',
    src: binaryPatternPng,
  },
  'samsung-laptop-silhouette': {
    id: 'samsung-laptop-silhouette',
    label: 'Samsung Laptop',
    src: samsungLaptopSilhouettePng,
  },
  'monitor-silhouette': {
    id: 'monitor-silhouette',
    label: 'Monitor',
    src: monitorSilhouettePng,
  },
  'memory-chip': {
    id: 'memory-chip',
    label: 'Memory Chip',
    src: memoryChipPng,
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
