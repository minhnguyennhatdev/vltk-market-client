# DataApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**dataControllerGetByIdV1**](#datacontrollergetbyidv1) | **GET** /api/v1/data/{index}/{id} | |
|[**dataControllerListV1**](#datacontrollerlistv1) | **GET** /api/v1/data/{index} | |

# **dataControllerGetByIdV1**
> DataControllerGetByIdV1200Response dataControllerGetByIdV1()


### Example

```typescript
import {
    DataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DataApi(configuration);

let index: string; //Logical index name (e.g. items) (default to undefined)
let id: string; //Document id (default to undefined)

const { status, data } = await apiInstance.dataControllerGetByIdV1(
    index,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**string**] | Logical index name (e.g. items) | defaults to undefined|
| **id** | [**string**] | Document id | defaults to undefined|


### Return type

**DataControllerGetByIdV1200Response**

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

# **dataControllerListV1**
> DataControllerListV1200Response dataControllerListV1()


### Example

```typescript
import {
    DataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DataApi(configuration);

let index: string; //Logical index name (e.g. items) (default to undefined)
let sort: object; //Sort order (e.g. nested params: sort[createdAt]=desc) (optional) (default to undefined)
let skip: number; //Number of items to skip (offset) (optional) (default to undefined)
let limit: number; //Page size (optional) (default to undefined)
let query: object; //JSON object: { \"fieldName\": { \"eq\"|\"gte\"|\"lte\"|\"gt\"|\"lt\"|\"in\"|\"match\": value } } (optional) (default to undefined)

const { status, data } = await apiInstance.dataControllerListV1(
    index,
    sort,
    skip,
    limit,
    query
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**string**] | Logical index name (e.g. items) | defaults to undefined|
| **sort** | **object** | Sort order (e.g. nested params: sort[createdAt]&#x3D;desc) | (optional) defaults to undefined|
| **skip** | [**number**] | Number of items to skip (offset) | (optional) defaults to undefined|
| **limit** | [**number**] | Page size | (optional) defaults to undefined|
| **query** | **object** | JSON object: { \&quot;fieldName\&quot;: { \&quot;eq\&quot;|\&quot;gte\&quot;|\&quot;lte\&quot;|\&quot;gt\&quot;|\&quot;lt\&quot;|\&quot;in\&quot;|\&quot;match\&quot;: value } } | (optional) defaults to undefined|


### Return type

**DataControllerListV1200Response**

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

