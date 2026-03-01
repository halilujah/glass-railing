import type { LayoutParams, ValidationError } from '../types';
import { BASE_SHOE_PROFILES } from '../constants/profiles';

export function validateParams(params: LayoutParams): ValidationError[] {
  const errors: ValidationError[] = [];

  if (params.segmentALength < 200) {
    errors.push({ field: 'segmentALength', message: 'Segment A must be at least 200mm', severity: 'error' });
  }
  if (params.segmentALength > 20000) {
    errors.push({ field: 'segmentALength', message: 'Segment A exceeds 20,000mm maximum', severity: 'error' });
  }

  if (params.layoutType === 'l-shape') {
    if (params.segmentBLength < 200) {
      errors.push({ field: 'segmentBLength', message: 'Segment B must be at least 200mm', severity: 'error' });
    }
    if (params.segmentBLength > 20000) {
      errors.push({ field: 'segmentBLength', message: 'Segment B exceeds 20,000mm maximum', severity: 'error' });
    }
  }

  if (params.minPanelWidth >= params.maxPanelWidth) {
    errors.push({ field: 'minPanelWidth', message: 'Min panel width must be less than max', severity: 'error' });
  }

  if (params.minPanelWidth < 100) {
    errors.push({ field: 'minPanelWidth', message: 'Min panel width must be at least 100mm', severity: 'error' });
  }

  if (params.edgeClearance * 2 >= params.segmentALength) {
    errors.push({ field: 'edgeClearance', message: 'Edge clearances exceed segment A length', severity: 'error' });
  }

  if (params.panelGap < 0) {
    errors.push({ field: 'panelGap', message: 'Panel gap cannot be negative', severity: 'error' });
  }

  if (params.systemHeight < 500 || params.systemHeight > 2000) {
    errors.push({ field: 'systemHeight', message: 'System height must be between 500mm and 2000mm', severity: 'error' });
  }

  if (params.glassThickness <= 0) {
    errors.push({ field: 'glassThickness', message: 'Glass thickness must be positive', severity: 'error' });
  }

  // Profile compatibility check
  const profile = BASE_SHOE_PROFILES.find(p => p.id === params.baseShoeProfileId);
  if (profile && !profile.compatibleThicknesses.includes(params.glassThickness)) {
    errors.push({
      field: 'glassThickness',
      message: `${profile.name} does not support ${params.glassThickness}mm glass. Compatible: ${profile.compatibleThicknesses.join(', ')}mm`,
      severity: 'warning',
    });
  }

  return errors;
}
