import chipsetRamStickSvg from '@/assets/cards-renamed/chipset-ram-stick.svg';
import storageNvmeBladeSvg from '@/assets/cards-renamed/storage-nvme-blade.svg';
import storageSataDriveSvg from '@/assets/cards-renamed/storage-sata-drive.svg';
import processorCoreChipSvg from '@/assets/cards-renamed/processor-core-chip.svg';
import graphicsGpuBoardSvg from '@/assets/cards-renamed/graphics-gpu-board.svg';
import boardMainMotherboardSvg from '@/assets/cards-renamed/board-main-motherboard.svg';
import boardLogicCircuitSvg from '@/assets/cards-renamed/board-logic-circuit.svg';
import thermalCoolingFanSvg from '@/assets/cards-renamed/thermal-cooling-fan.svg';
import portableUsbDriveSvg from '@/assets/cards-renamed/portable-usb-drive.svg';
import connectorHdmiCableSvg from '@/assets/cards-renamed/connector-hdmi-cable.svg';
import connectorEthernetPortSvg from '@/assets/cards-renamed/connector-ethernet-port.svg';
import displayMonitorScreenSvg from '@/assets/cards-renamed/display-monitor-screen.svg';
import deviceSamsungLaptopSvg from '@/assets/cards-renamed/device-samsung-laptop.svg';
import storageSamsungSsdSvg from '@/assets/cards-renamed/storage-samsung-ssd.svg';
import memoryModuleStickSvg from '@/assets/cards-renamed/memory-module-stick.svg';
import storageHardDiskSvg from '@/assets/cards-renamed/storage-hard-disk.svg';
import legacyFloppyDiskSvg from '@/assets/cards-renamed/legacy-floppy-disk.svg';
import legacyDvdDiscSvg from '@/assets/cards-renamed/legacy-dvd-disc.svg';
import legacyCdDiscSvg from '@/assets/cards-renamed/legacy-cd-disc.svg';
import digitalBinaryCoreSvg from '@/assets/cards-renamed/digital-binary-core.svg';
import siliconMicrochipSvg from '@/assets/cards-renamed/silicon-microchip.svg';
import inputKeyboardSvg from '@/assets/cards-renamed/input-keyboard.svg';
import inputMouseSvg from '@/assets/cards-renamed/input-mouse.svg';
import infrastructureServerRackSvg from '@/assets/cards-renamed/infrastructure-server-rack.svg';

export interface CardArt {
  id: string;
  label: string;
  src: string;
}

const CARD_ART: Record<string, CardArt> = {
  'ram-module': {
    id: 'ram-module',
    label: 'RAM Module',
    src: chipsetRamStickSvg,
  },
  'nvme-ssd': {
    id: 'nvme-ssd',
    label: 'NVMe SSD',
    src: storageNvmeBladeSvg,
  },
  'sata-ssd': {
    id: 'sata-ssd',
    label: 'SATA SSD',
    src: storageSataDriveSvg,
  },
  'cpu-chip': {
    id: 'cpu-chip',
    label: 'CPU Chip',
    src: processorCoreChipSvg,
  },
  'gpu-card': {
    id: 'gpu-card',
    label: 'GPU Card',
    src: graphicsGpuBoardSvg,
  },
  motherboard: {
    id: 'motherboard',
    label: 'Motherboard',
    src: boardMainMotherboardSvg,
  },
  'circuit-board': {
    id: 'circuit-board',
    label: 'Circuit Board',
    src: boardLogicCircuitSvg,
  },
  'cooling-fan': {
    id: 'cooling-fan',
    label: 'Cooling Fan',
    src: thermalCoolingFanSvg,
  },
  'usb-drive': {
    id: 'usb-drive',
    label: 'USB Flash Drive',
    src: portableUsbDriveSvg,
  },
  'hdmi-cable': {
    id: 'hdmi-cable',
    label: 'HDMI Cable',
    src: connectorHdmiCableSvg,
  },
  'ethernet-port': {
    id: 'ethernet-port',
    label: 'Ethernet Port',
    src: connectorEthernetPortSvg,
  },
  monitor: {
    id: 'monitor',
    label: 'Monitor',
    src: displayMonitorScreenSvg,
  },
  'galaxy-book': {
    id: 'galaxy-book',
    label: 'Galaxy Laptop',
    src: deviceSamsungLaptopSvg,
  },
  'samsung-ssd': {
    id: 'samsung-ssd',
    label: 'Samsung SSD',
    src: storageSamsungSsdSvg,
  },
  'memory-stick': {
    id: 'memory-stick',
    label: 'Memory Stick',
    src: memoryModuleStickSvg,
  },
  'hard-drive': {
    id: 'hard-drive',
    label: 'Hard Drive',
    src: storageHardDiskSvg,
  },
  'floppy-disk': {
    id: 'floppy-disk',
    label: 'Floppy Disk',
    src: legacyFloppyDiskSvg,
  },
  'dvd-disc': {
    id: 'dvd-disc',
    label: 'DVD Disc',
    src: legacyDvdDiscSvg,
  },
  'cd-disc': {
    id: 'cd-disc',
    label: 'CD Disc',
    src: legacyCdDiscSvg,
  },
  'binary-core': {
    id: 'binary-core',
    label: 'Binary Core',
    src: digitalBinaryCoreSvg,
  },
  microchip: {
    id: 'microchip',
    label: 'Microchip',
    src: siliconMicrochipSvg,
  },
  keyboard: {
    id: 'keyboard',
    label: 'Keyboard',
    src: inputKeyboardSvg,
  },
  mouse: {
    id: 'mouse',
    label: 'Mouse',
    src: inputMouseSvg,
  },
  'server-rack': {
    id: 'server-rack',
    label: 'Server Rack',
    src: infrastructureServerRackSvg,
  },
};

export const CARD_ART_IDS = Object.keys(CARD_ART);

export const getCardArt = (id: string): CardArt => {
  return CARD_ART[id] ?? {
    id,
    label: id.replace(/-/g, ' '),
    src: chipsetRamStickSvg,
  };
};
