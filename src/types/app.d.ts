declare namespace App {
  type AccountStatus = 0 | 1 | 2
  type IDataType =
    | 'Object'
    | 'Array'
    | 'Number'
    | 'String'
    | 'Function'
    | 'Boolean'
    | 'Null'
    | 'Undefined'
    | 'Symbol'
    | 'BigInt'

  interface IFieldListType {
    field: string
    types: App.IDataType[]
    isOptional?: boolean
  }
  interface IListParamsType<T> {
    pageNo: number
    pageSize: number
    orderBy: string
    order: 'ASC' | 'DESC'
    queryCondition: T
  }
}
