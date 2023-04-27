declare namespace App {
  type IDataType =
    | 'Object'
    | 'Array'
    | 'Number'
    | 'String'
    | 'Function'
    | 'Boolean'
    | 'null'
    | 'undefined'
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
