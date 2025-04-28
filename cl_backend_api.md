## 1.用户(/user)

### 1.1 注册(/register) --Post

```json
{
  "userId": "",
  "userName": "",
  "userPassword": ""
}
```

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": "userId",
        "userName": "userName",
        "userPassword": null
    }
}

{
    "code": 400,
    "message": "用户已存在: userId",
    "data": null
}

//密码需为6-16位
{
    "code": 500,
    "message": "服务器内部错误",
    "data": null
}
```

### 1.2 登录(/login) --Post

```json
{
    "userId": "",
    "userPassword": ""
}
```

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": "userId",
        "userName": "userName",
        "userPassword": null
    }
}

{
    "code": 400,
    "message": "密码错误",
    "data": null
}

{
    "code": 400,
    "message": "用户不存在: userId",
    "data": null
}
```

### 1.3 查询(/{userId}) --Get

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": "userId",
        "userName": "userName",
        "userPassword": null
    }
}

{
    "code": 400,
    "message": "用户不存在",
    "data": null
}
```

### 1.4 修改(/{userId}) --Put

```json
{
    "userId": "userId",
    "userName": "userName",
    "userPassword": "userPassword"
}
```

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": "userId",
        "userName": "userName",
        "userPassword": null
    }
}

{
    "code": 400,
    "message": "用户不存在: userId",
    "data": null
}
```

## 2.实训室(/lab)

### 2.1 按照ID查询(/{labId}) --Get

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "labId": 1,
        "labName": "软件工程实训室",
        "labOpentime": "09:30:00",
        "labClosetime": "23:00:00",
        "labCapacity": 5,
        "labDescription": "实训室描述",
        "labStatus": "available"
    }
}
```

### 2.2 查询所有() --Get

```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "labId": 1,
            "labName": "软件工程实训室",
            "labOpentime": "09:30:00",
            "labClosetime": "23:00:00",
            "labCapacity": 5,
            "labDescription": "实训室描述",
            "labStatus": "available"
        },
        {
            "labId": 2,
            "labName": "软件实训室",
            "labOpentime": "09:30:00",
            "labClosetime": "23:00:00",
            "labCapacity": 50,
            "labDescription": "实训室描述",
            "labStatus": "available"
        }
    ]
}
```

## 3.预约(/reservation)

### 3.1 按用户ID查询(/user/{userId}) --Get

```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "reservationId": 29,
            "userId": "asdad",
            "labId": 1,
            "reservationDate": "2025-05-20",
            "startTime": "15:30:00",
            "endTime": "16:00:00",
            "reservationStatus": "confirmed",
            "purpose": "进行物理实验",
            "createdAt": "2025-04-28T09:43:50",
            "updatedAt": "2025-04-28T09:43:50"
        },
        {
            "reservationId": 32,
            "userId": "asdad",
            "labId": 1,
            "reservationDate": "2025-05-20",
            "startTime": "08:30:00",
            "endTime": "09:00:00",
            "reservationStatus": "confirmed",
            "purpose": "进行物理实验",
            "createdAt": "2025-04-28T09:44:57",
            "updatedAt": "2025-04-28T09:44:57"
        },
        {
            "reservationId": 33,
            "userId": "asdad",
            "labId": 1,
            "reservationDate": "2025-05-01",
            "startTime": "08:30:00",
            "endTime": "09:00:00",
            "reservationStatus": "confirmed",
            "purpose": "进行物理实验",
            "createdAt": "2025-04-28T09:45:03",
            "updatedAt": "2025-04-28T09:45:03"
        }
    ]
}

{
    "code": 200,
    "message": "success",
    "data": []
}
```

### 3.2 按照labId和日期查询(/lab/{labId}/{date}) --Get

```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "reservationId": 33,
            "userId": "asdad",
            "labId": 1,
            "reservationDate": "2025-05-01",
            "startTime": "08:30:00",
            "endTime": "09:00:00",
            "reservationStatus": "confirmed",
            "purpose": "进行物理实验",
            "createdAt": "2025-04-28T09:45:03",
            "updatedAt": "2025-04-28T09:45:03"
        },
        {
            "reservationId": 34,
            "userId": "asdad",
            "labId": 1,
            "reservationDate": "2025-05-01",
            "startTime": "09:00:00",
            "endTime": "10:30:00",
            "reservationStatus": "confirmed",
            "purpose": "进行物理实验",
            "createdAt": "2025-04-28T09:56:47",
            "updatedAt": "2025-04-28T09:56:47"
        }
    ]
}

{
    "code": 200,
    "message": "success",
    "data": []
}
```

### 3.3 添加() --Post

```json
{
  "userId": "ccccc",
  "labId": 2,
  "reservationDate": "2025-05-15",
  "startTime": "12:00:00",
  "endTime": "13:00:00",
  "purpose": "进行物理实验"
}
```

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "reservationId": 36,
        "userId": "ccccc",
        "labId": 2,
        "reservationDate": "2025-05-15",
        "startTime": "12:00:00",
        "endTime": "13:00:00",
        "reservationStatus": "confirmed",
        "purpose": "进行物理实验",
        "createdAt": "2025-04-28T20:27:12.110705",
        "updatedAt": "2025-04-28T20:27:12.110705"
    }
}

{
    "code": 400,
    "message": "用户在该时段的预约已满",
    "data": null
}

{
    "code": 400,
    "message": "该时段预约已满",
    "data": null
}

{
    "code": 400,
    "message": "预约时间段不合法: 08:30 - 08:00",
    "data": null
}
```

### 3.4 取消预约(/{reservationId}/cancel) --Put

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "reservationId": 36,
        "userId": "ccccc",
        "labId": 2,
        "reservationDate": "2025-05-15",
        "startTime": "12:00:00",
        "endTime": "13:00:00",
        "reservationStatus": "cancelled",
        "purpose": "进行物理实验",
        "createdAt": "2025-04-28T20:27:12",
        "updatedAt": "2025-04-28T20:29:58.52044"
    }
}

{
    "code": 400,
    "message": "预约已取消，无法重复操作",
    "data": null
}

{
    "code": 400,
    "message": "预约不存在: 35",
    "data": null
}
```
