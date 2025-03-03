import { useGlobalConfigProvider, usePagination, useRequest } from './hooks'
import NormAxios from './norm-axios'

export default { NormFetch: NormAxios, useFetch: useRequest, usePagination, useGlobalProvider: useGlobalConfigProvider }
