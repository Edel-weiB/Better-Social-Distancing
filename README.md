# Project CoTrace

Project CoTrace is a system created as part of an assessment in Bachelor of Information Technology to construct an application for Contact Tracing which can be applicable on a more global scale. It is based on the trust system so that people responsibly declare the places they go so that effective contract tracing can occur in our fight against the COVID-19.

## System Implementation

We have an Android Application as our end-user facing interface for people to register signup
and checkin locations

## System Architecture

Down Below is the image showing the sample architecture of the setup we made.

![til](./Resource/mccree.gif)

McCree:

> Easy.

## Database

Copy and rename `ATLAS_credendials_template.json` into `ATLAS_credendials.json`

And fill in the `username`, `password`, `cluster` and `HostName`

DON'T CHANGE ANYTHING ELSE

## Node

### Installation

simply

```
cd Backend
npm install
```

### Running

in cmd in the Backend directory

```
npm start
```

### Run Tests

in cmd/Terminal in the Backend directory

```
npm run test
```

## Map DB functions

### Add a point

```
localhost:3000/map/add?pointx=888&pointy=777
```
