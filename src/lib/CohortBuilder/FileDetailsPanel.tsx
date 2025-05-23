import React from 'react';
import {
  Anchor,
  Group,
  LoadingOverlay,
  Stack,
  Table,
  Text,
  CopyButton,
  ActionIcon,
  Tooltip,
  Button,
} from '@mantine/core';
import { useGeneralGQLQuery, GEN3_FENCE_API } from '@gen3/core';
import {
  ErrorCard,
  type TableDetailsPanelProps,
  ExplorerTableDetailsPanelFactory,
} from '@gen3/frontend';
import {
  MdContentCopy as IconCopy,
  MdCheck as IconCheck,
} from 'react-icons/md';

// a definition of the query response
interface QueryResponse {
  data?: Record<string, Array<any>>;
}

/**
 * Checks if the given object is a QueryResponse.
 *
 * @param {any} obj - The object to be checked.
 * @returns {boolean} Returns true if the object is a QueryResponse, false otherwise.
 */
const isQueryResponse = (obj: any): obj is QueryResponse => {
  // Considering that the data property can be optional
  return (
    typeof obj === 'object' &&
    (obj.data === undefined || typeof obj.data === 'object')
  );
};

/**
 * Extracts data from a QueryResponse object based on an index.
 *
 * @param {QueryResponse} data - The QueryResponse object containing the data.
 * @param {string} index - The index to extract the data from.
 * @returns {Record<string, any>} - The extracted data as a key-value pair object.
 */
const extractData = (
  data: QueryResponse,
  index: string,
): Record<string, any> => {
  if (data === undefined || data === null) return {};
  if (data.data === undefined || data.data === null) return {};

  return Array.isArray(data.data[index]) && data.data[index].length > 0
    ? data.data[index][0]
    : {};
};

export const FileDetailsPanel = ({
  id,
  index,
  tableConfig,
  onClose,
}: TableDetailsPanelProps) => {
  // get the idField from the configuration
  const idField = tableConfig.detailsConfig?.idField;
  // call the general Guppy GQL which takes an object { query: string, variables: object }
  const { data, isLoading, isError } = useGeneralGQLQuery({
    query: `query ($filter: JSON) {
        ${index} (filter: $filter,  accessibility: all) {
        ${tableConfig.fields}
        }
      }`,
    variables: {
      filter: {
        AND: [
          {
            IN: {
              [idField ?? 0]: [id],
            },
          },
        ],
      },
    },
  });

  // handle misconfiguration
  if (!idField) {
    return (
      <ErrorCard message={'idField not configure in Tables Details Config'} />
    );
  }
  // show data error if graphql fails
  if (isError) {
    return <ErrorCard message={'Error occurred while fetching data'} />;
  }

  // process guppy response
  const queryData = isQueryResponse(data) ? extractData(data, index) : {};

  // create the rows for the table
  const rows = Object.entries(queryData).map(([field, value]) => (
    <Table.Tr key={field}>
      <Table.Td>
        <Text fw={700}>{field}</Text>
      </Table.Td>
      <Table.Td>
        {/*
          if field is one that we want a link for make it an Anchor otherwise
          render as text.
         */}
        {field === 'object_id' ? (
          <Anchor
            href={`${GEN3_FENCE_API}/data/download/${
              value ? (value as string) : ''
            }?redirect=true`}
            target="_blank"
          >
            {value ? (value as string) : ''}
          </Anchor>
        ) : (
          <Text>{value ? (value as string) : ''}</Text>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Text color="primary.4">Results for {id}</Text>
      <Table withTableBorder withColumnBorders>
        <Table.Th>
          <Table.Td>
            <Table.Th>Field</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Td>
        </Table.Th>
        <tbody>{rows}</tbody>
      </Table>
      <Group justify="flex-end">
        <CopyButton value={JSON.stringify(queryData)} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? 'Copied' : 'Copy'}
              withArrow
              position="right"
            >
              <ActionIcon color={copied ? 'accent.4' : 'gray'} onClick={copy}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
        <Button color="accent.5" onClick={() => onClose && onClose(id)}>
          Close
        </Button>
      </Group>
    </Stack>
  );
};

export const registerCustomExplorerDetailsPanels = () => {
  ExplorerTableDetailsPanelFactory().registerRendererCatalog({
    // NOTE: The catalog name must be tableDetails
    tableDetails: { fileDetails: FileDetailsPanel }, // TODO: add simpler registration function that ensures the catalog name is tableDetails
  });
};
