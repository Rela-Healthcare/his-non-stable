import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

interface TruncatedTextProps {
  text?: string | React.ReactNode | null;
  maxLength?: number;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  tooltipId?: string;
  as?: 'span' | 'div';
  hideTooltipIfFits?: boolean;
  middleEllipsis?: boolean;
  alwaysShowTooltip?: boolean;
  tooltipText?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text = '',
  maxLength = 14,
  className = '',
  placement = 'top',
  tooltipId,
  as = 'span',
  hideTooltipIfFits = true,
  middleEllipsis = false,
  alwaysShowTooltip = false,
  tooltipText,
}) => {
  const Wrapper = as;

  const isString = typeof text === 'string';

  if (!isString && !React.isValidElement(text)) {
    return null; // if it's not a valid react node, return nothing
  }

  const shouldTruncate = isString && (text as string).length > maxLength;
  let displayText = text;

  if (isString && shouldTruncate) {
    if (middleEllipsis) {
      const frontLen = Math.floor(maxLength / 2);
      const backLen = maxLength - frontLen;
      displayText = `${(text as string).slice(0, frontLen)}...${(
        text as string
      ).slice(-backLen)}`;
    } else {
      displayText = (text as string).slice(0, maxLength) + '...';
    }
  }

  const tooltip = (
    <Tooltip id={tooltipId || `tooltip-${Math.random()}`}>
      {tooltipText || (isString ? text : '')}
    </Tooltip>
  );

  const showTooltip =
    (isString && (shouldTruncate || alwaysShowTooltip)) ||
    (!isString && alwaysShowTooltip);

  if (!showTooltip) {
    return <Wrapper className={className}>{displayText}</Wrapper>;
  }

  return (
    <OverlayTrigger placement={placement} overlay={tooltip}>
      <Wrapper className={`cursor-pointer ${className}`}>{displayText}</Wrapper>
    </OverlayTrigger>
  );
};

export default TruncatedText;
