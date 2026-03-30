# CreateItemRequestDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**priceCurrency** | [**Currency**](Currency.md) |  | [optional] [default to undefined]
**askingPrice** | **number** |  | [optional] [default to undefined]
**owner** | [**ItemOwnerDTO**](ItemOwnerDTO.md) |  | [default to undefined]
**category** | [**Category**](Category.md) |  | [default to undefined]
**slot** | [**Slot**](Slot.md) |  | [optional] [default to undefined]
**weaponType** | [**WeaponType**](WeaponType.md) |  | [optional] [default to undefined]
**element** | [**Element**](Element.md) |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**gender** | [**Gender**](Gender.md) |  | [optional] [default to undefined]
**stats** | [**Array&lt;StatEntryDTO&gt;**](StatEntryDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateItemRequestDTO } from './api';

const instance: CreateItemRequestDTO = {
    name,
    description,
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
