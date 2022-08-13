---
title: bartender v1.0.0
language_tabs:
  - "'javascript": Javascript'
language_clients:
  - "'javascript": ""
toc_footers: []
includes: []
search: true
highlight_theme: atom-one-dark
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="bartender">bartender v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API that keeps track of products

Base URLs:

* <a href="{baseUrl}">{baseUrl}</a>

Email: <a href="mailto:t.d.vandeweerd@student.utwente.nl">Thomas van de Weerd</a> 
License: <a href="https://spdx.org/licenses/GPL-3.0-or-later.html">GNU General Public License v3.0 or later</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="bartender-health">Health</h1>

API Health

## Get API Health

<a id="opIdgetHealth"></a>

> Code samples

`GET /health`

Get whether or not the API is currently healthy

> Example responses

> OK

```json
{
  "healthy": true,
  "checks": {
    "memory": {
      "status": "up",
      "used": 300,
      "max": 512
    },
    "response-time": {
      "50": 7,
      "90": 12,
      "95": 14,
      "average": 8
    }
  },
  "dependencies": {
    "database": {
      "name": "Postgre",
      "healthy": true,
      "latency": 3
    },
    "external-api": {
      "name": "Some API",
      "healthy": true,
      "latency": 20
    }
  }
}
```

> Service Unavailable

```json
{
  "healthy": true,
  "checks": {
    "memory": {
      "status": "up",
      "used": 300,
      "max": 512
    },
    "response-time": {
      "50": 7,
      "90": 12,
      "95": 14,
      "average": 8
    }
  },
  "dependencies": {
    "database": {
      "name": "Postgre",
      "healthy": true,
      "latency": 3
    },
    "external-api": {
      "name": "Some API",
      "healthy": true,
      "latency": 20
    }
  }
}
```

<h3 id="get-api-health-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Health](#schemahealth)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Service Unavailable|[Health](#schemahealth)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Get API readiness

<a id="opIdgetIsServerReady"></a>

> Code samples

`GET /health/ready`

A basic ping-pong to check if the server is able to receive requests and respond to them

<h3 id="get-api-readiness-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

<h1 id="bartender-product">Product</h1>

Handles products

## Find product by GTIN

<a id="opIdgetProduct"></a>

> Code samples

`GET /product/{gtin}`

Checks if the GTIN exists in the database, returns the matching product if it does, otherwise returns a 404 Not Found

<h3 id="find-product-by-gtin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gtin|path|string|true|GTIN of the product we want to request|

> Example responses

> Found product by GTIN

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

> Could not find product by GTIN

```json
{
  "code": 404,
  "message": "Was not able to find product for GTIN 8716700027200"
}
```

> Unexpected error

```json
{
  "code": 500,
  "message": "Something went wrong"
}
```

<h3 id="find-product-by-gtin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Found product by GTIN|[Product](#schemaproduct)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Could not find product by GTIN|[Error](#schemaerror)|
|default|Default|Unexpected error|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Update product

<a id="opIdupdateProduct"></a>

> Code samples

`PATCH /product/{gtin}`

Change some data about a product

> Body parameter

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

<h3 id="update-product-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gtin|path|string|true|GTIN of the product we want to request|
|body|body|[ProductProperties](#schemaproductproperties)|false|none|

> Example responses

> OK

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

> Not Found

```json
{
  "code": 404,
  "message": "Could not find product with GTIN 8716700027200"
}
```

<h3 id="update-product-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Product](#schemaproduct)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Delete product

<a id="opIddeleteProduct"></a>

> Code samples

`DELETE /product/{gtin}`

Remove a product from the database

<h3 id="delete-product-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|gtin|path|string|true|GTIN of the product we want to request|

<h3 id="delete-product-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Search for product

<a id="opIdsearchProduct"></a>

> Code samples

`POST /product/search`

Tries to find the product matching all the data you give. Will start by checking GTIN, then validating the rest of the data that should not change like quantity. In case it can not find it by GTIN, it will try to find a very close match by using the name and quantity. This match needs to be above a certain treshold for it to be returned.

> Body parameter

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

<h3 id="search-for-product-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ProductProperties](#schemaproductproperties)|false|The partial data you have about the item you want to find.|

> Example responses

> Not Found

```json
{
  "code": 404,
  "message": "Was not able to find a matching product"
}
```

<h3 id="search-for-product-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|[Error](#schemaerror)|

<h3 id="search-for-product-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ProductProperties](#schemaproductproperties)|false|none|none|
|»» gtin|string|false|none|none|
|»» name|string|false|none|none|
|»» description|string|false|none|none|
|»» category|string|false|none|none|
|»» brand|string|false|none|none|
|»» images|[[Image](#schemaimage)]|false|none|none|
|»»» height|integer(int32)|true|none|none|
|»»» width|integer(int32)|true|none|none|
|»»» url|string|true|none|none|
|»» quantity|[ProductQuantity](#schemaproductquantity)|false|none|none|
|»»» value|integer(int64)|true|none|none|
|»»» unit|string|true|none|none|
|»»» amount|integer(int64)|true|none|none|
|»»» total|integer(int64)|true|none|none|
|»» attributes|[ProductAttributes](#schemaproductattributes)|false|none|none|
|»»» *anonymous*|string|false|none|none|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ProductRequiredProperties](#schemaproductrequiredproperties)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Get all products

<a id="opIdgetProducts"></a>

> Code samples

`GET /product`

Get all products stored in the database

> Example responses

> OK

```json
[
  {
    "gtin": "8716700027200",
    "name": "Grolsch Pilsener krat",
    "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
    "category": "beer",
    "images": [
      {
        "height": 800,
        "width": 800,
        "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
      }
    ],
    "brand": "Grolsch",
    "quantity": {
      "value": 300,
      "unit": "ml",
      "amount": 24,
      "total": 7200
    },
    "attributes": {
      "alcohol_percentage": 5,
      "contains_alcohol": true,
      "": "string"
    }
  }
]
```

<h3 id="get-all-products-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-all-products-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ProductProperties](#schemaproductproperties)|false|none|none|
|»» gtin|string|false|none|none|
|»» name|string|false|none|none|
|»» description|string|false|none|none|
|»» category|string|false|none|none|
|»» brand|string|false|none|none|
|»» images|[[Image](#schemaimage)]|false|none|none|
|»»» height|integer(int32)|true|none|none|
|»»» width|integer(int32)|true|none|none|
|»»» url|string|true|none|none|
|»» quantity|[ProductQuantity](#schemaproductquantity)|false|none|none|
|»»» value|integer(int64)|true|none|none|
|»»» unit|string|true|none|none|
|»»» amount|integer(int64)|true|none|none|
|»»» total|integer(int64)|true|none|none|
|»» attributes|[ProductAttributes](#schemaproductattributes)|false|none|none|
|»»» *anonymous*|string|false|none|none|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ProductRequiredProperties](#schemaproductrequiredproperties)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

## Create product

<a id="opIdcreateProduct"></a>

> Code samples

`POST /product`

Add a product to the database

> Body parameter

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

<h3 id="create-product-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Product](#schemaproduct)|false|none|

> Example responses

> OK

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}
```

> Already exists

```json
{
  "code": 409,
  "message": "Resource already exists"
}
```

<h3 id="create-product-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[Product](#schemaproduct)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Already exists|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerToken
</aside>

# Schemas

<h2 id="tocS_Product">Product</h2>
<!-- backwards compatibility -->
<a id="schemaproduct"></a>
<a id="schema_Product"></a>
<a id="tocSproduct"></a>
<a id="tocsproduct"></a>

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}

```

### Properties

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[ProductProperties](#schemaproductproperties)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[ProductRequiredProperties](#schemaproductrequiredproperties)|false|none|none|

<h2 id="tocS_ProductProperties">ProductProperties</h2>
<!-- backwards compatibility -->
<a id="schemaproductproperties"></a>
<a id="schema_ProductProperties"></a>
<a id="tocSproductproperties"></a>
<a id="tocsproductproperties"></a>

```json
{
  "gtin": "8716700027200",
  "name": "Grolsch Pilsener krat",
  "description": "Grolsch Premium pilsner is vol van smaak met een aangename bitterheid en een rijke afdronk. Het wordt gebrouwen met twee soorten hop. Dit geeft Grolsch Premium pilsner haar unieke karakter.",
  "category": "beer",
  "images": [
    {
      "height": 800,
      "width": 800,
      "url": "https://static.ah.nl/dam/product/AHI_43545239383734363237?revLabel=1&rendition=800x800_JPG_Q90&fileType=binary"
    }
  ],
  "brand": "Grolsch",
  "quantity": {
    "value": 300,
    "unit": "ml",
    "amount": 24,
    "total": 7200
  },
  "attributes": {
    "alcohol_percentage": 5,
    "contains_alcohol": true,
    "": "string"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|gtin|string|false|none|none|
|name|string|false|none|none|
|description|string|false|none|none|
|category|string|false|none|none|
|brand|string|false|none|none|
|images|[[Image](#schemaimage)]|false|none|none|
|quantity|[ProductQuantity](#schemaproductquantity)|false|none|none|
|attributes|[ProductAttributes](#schemaproductattributes)|false|none|none|

<h2 id="tocS_ProductRequiredProperties">ProductRequiredProperties</h2>
<!-- backwards compatibility -->
<a id="schemaproductrequiredproperties"></a>
<a id="schema_ProductRequiredProperties"></a>
<a id="tocSproductrequiredproperties"></a>
<a id="tocsproductrequiredproperties"></a>

```json
{}

```

### Properties

*None*

<h2 id="tocS_ProductAttributes">ProductAttributes</h2>
<!-- backwards compatibility -->
<a id="schemaproductattributes"></a>
<a id="schema_ProductAttributes"></a>
<a id="tocSproductattributes"></a>
<a id="tocsproductattributes"></a>

```json
{
  "alcohol_percentage": 5,
  "contains_alcohol": true,
  "": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|none|

<h2 id="tocS_ProductQuantity">ProductQuantity</h2>
<!-- backwards compatibility -->
<a id="schemaproductquantity"></a>
<a id="schema_ProductQuantity"></a>
<a id="tocSproductquantity"></a>
<a id="tocsproductquantity"></a>

```json
{
  "value": 300,
  "unit": "ml",
  "amount": 24,
  "total": 7200
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|value|integer(int64)|true|none|none|
|unit|string|true|none|none|
|amount|integer(int64)|true|none|none|
|total|integer(int64)|true|none|none|

<h2 id="tocS_Image">Image</h2>
<!-- backwards compatibility -->
<a id="schemaimage"></a>
<a id="schema_Image"></a>
<a id="tocSimage"></a>
<a id="tocsimage"></a>

```json
{
  "height": 300,
  "width": 200,
  "url": "https://picsum.photos/200/300"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|height|integer(int32)|true|none|none|
|width|integer(int32)|true|none|none|
|url|string|true|none|none|

<h2 id="tocS_Error">Error</h2>
<!-- backwards compatibility -->
<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "code": 500,
  "message": "Something went wrong"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|integer(int32)|true|none|none|
|message|string|true|none|none|

<h2 id="tocS_Health">Health</h2>
<!-- backwards compatibility -->
<a id="schemahealth"></a>
<a id="schema_Health"></a>
<a id="tocShealth"></a>
<a id="tocshealth"></a>

```json
{
  "healthy": true,
  "checks": {
    "memory": {
      "status": "up",
      "used": 300,
      "max": 512
    },
    "response-time": {
      "50": 7,
      "90": 12,
      "95": 14,
      "average": 8
    }
  },
  "dependencies": {
    "database": {
      "name": "Postgre",
      "healthy": true,
      "latency": 3
    }
  }
}

```

The current health of the api

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|healthy|boolean|false|none|none|
|checks|object|false|none|none|
|» memory|object|false|none|none|
|»» status|string|false|none|none|
|»» used|integer|false|none|none|
|»» max|integer|false|none|none|
|» response-time|object|false|none|none|
|»» 50|integer|false|none|none|
|»» 90|integer|false|none|none|
|»» 95|integer|false|none|none|
|»» average|integer|false|none|none|
|dependencies|object|false|none|none|
|» *anonymous*|[HealthDependency](#schemahealthdependency)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|up|
|status|partial|
|status|down|

<h2 id="tocS_HealthDependency">HealthDependency</h2>
<!-- backwards compatibility -->
<a id="schemahealthdependency"></a>
<a id="schema_HealthDependency"></a>
<a id="tocShealthdependency"></a>
<a id="tocshealthdependency"></a>

```json
{
  "name": "string",
  "latency": 0,
  "healthy": true
}

```

HealthDependency

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|latency|integer|true|none|none|
|healthy|boolean|true|none|none|

