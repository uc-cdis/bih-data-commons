import React, { ReactNode } from 'react';
import {
  ExplorerTableCellRendererFactory,
  type CellRendererFunctionProps,
} from '@gen3/frontend';
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { FaExternalLinkAlt } from 'react-icons/fa';

const RenderDicomLink = ({ cell }: CellRendererFunctionProps) => {
  if (!cell?.getValue() || cell?.getValue() === '') {
    return <span></span>;
  } else
    return (
      <a href={`${cell.getValue()}`} target="_blank" rel="noreferrer">
        <ActionIcon color="accent.5" size="md" variant="filled">
          <FaExternalLinkAlt />
        </ActionIcon>
      </a>
    );
};


interface LinkCellOptions {
  icon: string;
  color: string;
  variant: string;
  size: string;
  tooltip: boolean;
}

const RenderLinkIconDefaultParameters : LinkCellOptions = {
  icon: 'gen3:external-link', // TODO
  color: 'accent.5',
  variant: 'filled',
  size: 'md',
  tooltip: false,
}

/**
 * RenderLinkWithIcon is a functional component that renders a hyperlink with an associated icon inside a tooltip.
 *
 * This component primarily checks if a value exists in the `cell` object provided as a property. If there is no
 * value or the value is an empty string, it returns an empty span. Otherwise, a link is rendered with customizable
 * icon appearance and tooltip functionality.
 *
 * Parameters for styling and behavior can be passed through `params`, which override the default configurations.
 *
 * @param {Object} props - The component props.
 * @param {CellRendererFunctionProps} props.cell - Contains the value for the hyperlink.
 * @param {...Array<Record<string, unknown>>} params - Additional configuration parameters for the rendered link and its icon. Defaults are defined in `RenderLinkIconDefaultParameters`.
 * @returns {React.ReactNode} A React element representing a tooltip-wrapped link with an icon, or an empty span if no value is present in `cell`.
 */
const RenderLinkWithIcon = ({ cell }: CellRendererFunctionProps,
                            ...params: Array<Record<string, unknown>>) => {
  if (!cell?.getValue() || cell?.getValue() === '') {
    return <span></span>;
  } else {
    const mergedParams = { ...RenderLinkIconDefaultParameters,  ...(params ? params[0] : {}) };
    const { variant, color, size, tooltip } = mergedParams;
    return (
      <Tooltip label={cell.getValue() as string} disabled={tooltip ? !tooltip :  true} >
      <a href={`${cell.getValue()}`} target="_blank" rel="noreferrer">

        <ActionIcon size={size} variant={variant} color={color}>
          <FaExternalLinkAlt />
        </ActionIcon>

      </a>
      </Tooltip>
    );
  }
};


export const registerCohortTableCustomCellRenderers = () => {
  ExplorerTableCellRendererFactory().registerRenderer(
    'link',
    'linkWithIconAndTooltip',
    RenderLinkWithIcon,
  );
};
