import { DSL, IF_HAVE } from '@shell/store/type-map';

export const NAME = 'minio';

export function init(store) {
  const {
    product,
    basicType,
    virtualType,
    configureType,
  } = DSL(store, NAME)

  product({
    ifHave: IF_HAVE.V2_MONITORING,
    icon: 'monitoring',
    showNamespaceFilter: true,
    weight: 90,
  });

  virtualType({
    label: 'Minio',
    namespaced: false,
    name: 'minio-overview',
    weight: 105,
    route:      { name: 'c-cluster-monitoring' },
    exact: true,
    overview: true,
  });

  basicType([
     'minio-overview',
  ])
}
