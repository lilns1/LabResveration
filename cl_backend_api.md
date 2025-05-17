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

### 1.3 按照用户ID查询(/{userId}) --Get

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

### 1.4 查找所有用户() --Get

```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "userId": "123456",
            "userName": "llllll",
            "userPassword": "123456",
            "userRole": "user"
        },
        {
            "userId": "1234567",
            "userName": "1234567",
            "userPassword": "123456",
            "userRole": "user"
        },
        {
            "userId": "231170020073",
            "userName": "lls",
            "userPassword": "234567",
            "userRole": "user"
        },
        {
            "userId": "231170020074",
            "userName": "lqa",
            "userPassword": "123321",
            "userRole": "user"
        },
        {
            "userId": "231170020081",
            "userName": "lxh",
            "userPassword": "234567",
            "userRole": "user"
        },
        {
            "userId": "235555",
            "userName": "1321213",
            "userPassword": "123456",
            "userRole": null
        },
        {
            "userId": "5122010343",
            "userName": "xhx",
            "userPassword": "123456",
            "userRole": "user"
        }
    ]
}
```

### 1.5 修改(/{userId}) --Put

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

### 1.6 删除(/{userId}) --Delete

```json
{
    "code": 200,
    "message": "success",
    "data": "删除成功"
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

### 2.3 修改实验室信息(/{labId}) --Post

### 2.4 新增实验室(/{add}) --Post

### 2.5 删除实验室(/{labId}) --Delete

## 3.预约(/reservation)

### 3.0 获取全部 --GET

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

### 3.5 修改预约状态为已确认(/{reservationId}/confirm) --Put

### 3.6 修改预约状态为已拒绝(/{reservationId}/reject) --Put

## 4.公告(/notice)

### 4.1 查询所有公告 --Get
