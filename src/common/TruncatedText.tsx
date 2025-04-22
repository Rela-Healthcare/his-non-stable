import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

interface TruncatedTextProps {
  text?: string | null;
  maxLength?: number;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  tooltipId?: string;
  as?: 'span' | 'div';
  hideTooltipIfFits?: boolean;
  middleEllipsis?: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text = '',
  maxLength = 14,
  className = '',
  placement = 'top',
  tooltipId,
  as = 'span',
  hideTooltipIfFits = true,
  middleEllipsis = false, // DEFAULT FALSE
}) => {
  if (typeof text !== 'string') return null;

  const shouldTruncate = text.length > maxLength;
  let displayText = text;

  if (shouldTruncate) {
    if (middleEllipsis) {
      const frontLen = Math.floor(maxLength / 2);
      const backLen = maxLength - frontLen;
      displayText = `${text.slice(0, frontLen)}...${text.slice(-backLen)}`;
    } else {
      displayText = text.slice(0, maxLength) + '...';
    }
  }

  const Wrapper = as;
  const tooltip = (
    <Tooltip id={tooltipId || `tooltip-${Math.random()}`}>{text}</Tooltip>
  );

  if (!shouldTruncate && hideTooltipIfFits) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  return (
    <OverlayTrigger placement={placement} overlay={tooltip}>
      <Wrapper className={`cursor-pointer ${className}`}>{displayText}</Wrapper>
    </OverlayTrigger>
  );
};

export default TruncatedText;
