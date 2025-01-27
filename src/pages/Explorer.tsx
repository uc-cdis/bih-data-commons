import {
  ExplorerPage,
  ExplorerPageGetServerSideProps as getServerSideProps,
} from '@gen3/frontend';

import { registerCohortTableCustomCellRenderers } from '@/lib/CohortBuilder/CustomCellRenderers';
import { registerCustomExplorerDetailsPanels } from '@/lib/CohortBuilder/FileDetailsPanel';

registerCohortTableCustomCellRenderers();

export default ExplorerPage;

export { getServerSideProps };
