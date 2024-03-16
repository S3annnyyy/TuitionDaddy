# Tutor API For TuitionDaddy

## Details

```
This is a .NET(C#) project, using PostgreSQL as the database. There is no need to install any dependencies as this is automatically managed by Nuget.

The minimal web api was chosen: A Tutor Controller and 3 Schemas - Tutor Profile, Price, & Feedback.
```

## Running Application

### Running application (Docker mode)

```
To be updated
```

### Running application (CompileDaemon mode)

```
To be updated
```

## Accessing Swagger Documentation

```
1. cd to the directory 'TuitionDaddy/Tutor'
2. run this command: "dotnet run"
3. Access swagger via http://localhost:5116/swagger/index.html
Happy testing!
```

## Controller Method Routes

### Tutor Profiles [/Tutor]:

#### Description:

1.  Create Tutor Profile
    Endpoint: "/Tutor"
2.  Update Tutor Profile
    Endpoint: "/Tutor"
3.  Get All Tutor Profiles
    Endpoint: "/Tutor/all"
4.  Get Tutor Profile by ID
    Endpoint: "/Tutor/{TutorId}"

### Tutor Prices [/Tutor/price]:

#### Description:

1.  Create Tutor Price
    Endpoint: "/Tutor/price"
2.  Update Tutor Price
    Endpoint: "/Tutor/price"
3.  Get Tutor Prices
    Endpoint: "/Tutor/price/{TutorId}"
4.  Delete Tutor Prices
    Endpoint: "/Tutor/price"

### Tutor Slots [/Tutor/slots]:

#### Description:

1.  Create Tutor Slot
    Endpoint: "/Tutor/slots"
2.  Update Tutor Slot
    Endpoint: "/Tutor/slots/{SlotId}"
3.  Get All Slots of Tutor
    Endpoint: "/Tutor/slots/{TutorId}"
4.  Get Slot by SlotId
    Endpoint: "/Tutor/slots/{SlotId}"
5.  Delete Tutor Prices
    Endpoint: "/Tutor/slots/{SlotId}"

### Models

#### Tutor Profile

| Name            | Type   | Description | Required |
| --------------- | ------ | ----------- | -------- |
| TutorId         | int    |             | Yes      |
| Name            | string |             | Yes      |
| Description     | number |             | Yes      |
| Experience      | string |             | Yes      |
| Subject Level   |[string]|             | Yes      |
| Photo Link      | string |             | Yes      |

#### Tutor Price

| Name            | Type   | Description | Required |
| --------------- | ------ | ----------- | -------- |
| TutorId         | int    |             | Yes      |
| Subject Level   |[string]|             | Yes      |
| Price           | int    |             | Yes      |

#### Tutor Feedback

| Name            | Type   | Description | Required |
| --------------- | ------ | ----------- | -------- |
| SlotId          | Guid   |             | Yes      |
| TutorId         | int    |             | Yes      |
| Students        | [int]  |             | Yes      |
| Capacity        | int    |             | Yes      |
| Start At        |DateTime|             | Yes      |
| Duration        | int    |             | Yes      |