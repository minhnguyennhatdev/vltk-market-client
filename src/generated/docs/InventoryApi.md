# InventoryApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**inventoryControllerCreateItemV1**](#inventorycontrollercreateitemv1) | **POST** /api/v1/inventories | |
|[**inventoryControllerDeleteItemV1**](#inventorycontrollerdeleteitemv1) | **DELETE** /api/v1/inventories/{id} | |
|[**inventoryControllerGetItemSpecsV1**](#inventorycontrollergetitemspecsv1) | **GET** /api/v1/inventories/specs | |
|[**inventoryControllerGetItemV1**](#inventorycontrollergetitemv1) | **GET** /api/v1/inventories/{id} | |
|[**inventoryControllerGetItemsV1**](#inventorycontrollergetitemsv1) | **GET** /api/v1/inventories | |
|[**inventoryControllerUploadItemImageV1**](#inventorycontrolleruploaditemimagev1) | **PUT** /api/v1/inventories/{id}/image | |

# **inventoryControllerCreateItemV1**
> InventoryControllerCreateItemV1200Response inventoryControllerCreateItemV1(createItemRequestDTO)


### Example

```typescript
import {
    InventoryApi,
    Configuration,
    CreateItemRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let createItemRequestDTO: CreateItemRequestDTO; //

const { status, data } = await apiInstance.inventoryControllerCreateItemV1(
    createItemRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createItemRequestDTO** | **CreateItemRequestDTO**|  | |


### Return type

**InventoryControllerCreateItemV1200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inventoryControllerDeleteItemV1**
> inventoryControllerDeleteItemV1()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.inventoryControllerDeleteItemV1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inventoryControllerGetItemSpecsV1**
> InventoryControllerGetItemSpecsV1200Response inventoryControllerGetItemSpecsV1()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

const { status, data } = await apiInstance.inventoryControllerGetItemSpecsV1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**InventoryControllerGetItemSpecsV1200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inventoryControllerGetItemV1**
> InventoryControllerCreateItemV1200Response inventoryControllerGetItemV1()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.inventoryControllerGetItemV1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**InventoryControllerCreateItemV1200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inventoryControllerGetItemsV1**
> InventoryControllerGetItemsV1200Response inventoryControllerGetItemsV1()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let sort: string; //Array of { key, order }. Order in array = sort priority (first = primary). JSON string or array. (optional) (default to undefined)
let skip: number; //Number of items to skip (offset) (optional) (default to undefined)
let limit: number; //Page size (optional) (default to undefined)
let query: string; //JSON string of field filters. Ops per field: eq, gte, lte, gt, lt, in, match. (optional) (default to undefined)

const { status, data } = await apiInstance.inventoryControllerGetItemsV1(
    sort,
    skip,
    limit,
    query
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sort** | [**string**] | Array of { key, order }. Order in array &#x3D; sort priority (first &#x3D; primary). JSON string or array. | (optional) defaults to undefined|
| **skip** | [**number**] | Number of items to skip (offset) | (optional) defaults to undefined|
| **limit** | [**number**] | Page size | (optional) defaults to undefined|
| **query** | [**string**] | JSON string of field filters. Ops per field: eq, gte, lte, gt, lt, in, match. | (optional) defaults to undefined|


### Return type

**InventoryControllerGetItemsV1200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inventoryControllerUploadItemImageV1**
> InventoryControllerCreateItemV1200Response inventoryControllerUploadItemImageV1()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: string; // (default to undefined)
let image: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.inventoryControllerUploadItemImageV1(
    id,
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **image** | [**File**] |  | (optional) defaults to undefined|


### Return type

**InventoryControllerCreateItemV1200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

