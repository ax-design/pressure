interface PressedStyle {
  invert: boolean;
  tiltFactor: number;
  tiltDepth: number;
  perspective: number;
  zoomFactor: number;
  tiltMode: string;
}

const getStyle = ($inEl: HTMLElement): PressedStyle => {
  const computedStyle = $inEl.computedStyleMap();

  return {
    invert: computedStyle.get('--pressure-invert').value === 'true',
    tiltFactor: computedStyle.get('--pressure-tilt-factor').value as number,
    tiltDepth: computedStyle.get('--pressure-tilt-depth').value as number,
    perspective: computedStyle.get('--pressure-perspective').value as number,
    zoomFactor: computedStyle.get('--pressure-zoom').value as number,
    tiltMode: computedStyle.get('--pressure-tilt-mode').value as string,
  }
}

const setPressedStyle = ($inEl: HTMLElement, $outEl: HTMLElement, event: PointerEvent) => {
  const props = getStyle($inEl);
  const transform = `perspective(${props.perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;

  $inEl.style.transform = transform;

  const { top, left, width, height } = $outEl.getBoundingClientRect();

  const currentX = Math.round(event.clientX - left);
  const currentY = Math.round(event.clientY - top);
  const centerX = currentX - width / 2;
  const centerY = currentY - height / 2;

  let degFactors:[number, number];

  switch (props.tiltMode) {
    case 'absolute':
      const sinX = props.tiltDepth/(width / 2);
      const sinY = props.tiltDepth/(height / 2);
      const degX = Math.asin(sinX > 0.99 ? 0.99 : sinX) * 180 / Math.PI;
      const degY = Math.asin(sinY > 0.99 ? 0.99 : sinY) * 180 / Math.PI;
      degFactors = [degX, degY];
      break;
    case 'relative':
      degFactors = [props.tiltFactor, props.tiltFactor];
      break;
    default:
      throw new SyntaxError('`--pressure-tilt-mode` should be `absolute` or `relative`!');
  }

  const ax = (centerX / width) * degFactors[0] * (props.invert ? -1 : 1);
  const ay = (centerY / height) * degFactors[1] * (props.invert ? 1 : -1);

  const z = (Math.abs(centerX) ** 2 + Math.abs(centerY) ** 2) / ((width / 2) ** 2 + (height / 2) ** 2) - 1;

  const _transform = `perspective(${props.perspective}px) rotateX(${ay}deg) rotateY(${ax}deg) translateZ(${z * props.zoomFactor}px)`;

  $inEl.style.transform = _transform;

  const resetStyle = () => {
    $inEl.style.transform = transform;

    document.removeEventListener('pointerup', resetStyle);
  };

  document.addEventListener('pointerup', resetStyle);
}

export { setPressedStyle };