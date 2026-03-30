# CreateItemResponseDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**_id** | **string** | Document id | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**image** | **string** |  | [optional] [default to undefined]
**priceCurrency** | **string** |  | [optional] [default to undefined]
**askingPrice** | **number** |  | [optional] [default to undefined]
**owner** | [**ItemOwnerDTO**](ItemOwnerDTO.md) |  | [default to undefined]
**category** | **string** |  | [default to undefined]
**slot** | **string** |  | [optional] [default to undefined]
**weaponType** | **string** |  | [optional] [default to undefined]
**element** | **string** |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**stats** | [**Array&lt;StatEntryDTO&gt;**](StatEntryDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateItemResponseDTO } from './api';

const instance: CreateItemResponseDTO = {
    _id,
    name,
    description,
    image,
    priceCurrency,
    askingPrice,
    owner,
    category,
    slot,
    weaponType,
    element,
    level,
    gender,
    stats,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
