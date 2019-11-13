import { Vector } from '@teedev/core';

import { Template } from '../interfaces/template';

export class TemplateSmall implements Template {
  size: Vector = new Vector();
  focalPoint: Vector = new Vector();
  quality: number = 90;
}
