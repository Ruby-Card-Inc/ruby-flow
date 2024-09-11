# Ruby Fullstack Assignment

## Project Description

This is a basic react flow app that was cloned using the following command:

```bash
npx degit xyflow/vite-react-flow-template ruby-flow
```

To run the app, please use the following commands:

```
npm install
npm run dev
```

Please look at [Installation and Requirements](https://reactflow.dev/learn/getting-started/installation-and-requirements) for more information

For the purpose of simplifying the backend for this assignment, we are going to use [Instant DB](https://www.instantdb.com/) to facilitate CRUD operations without the need of writing our own API. This way, we can focus the task on primarily frontend skills while simulating the needs for data consistency and persistance. Instant DB is very similar to firebase, you can upsert an array of nested objects to tables that don't exist, and the table will be automatically created and the data will automatically insert as well.

This is what the Instant DB tables look like

<img width="1311" alt="image" src="https://github.com/user-attachments/assets/3bf48d47-bdcc-405a-b61c-660c012a1cfa">

Please read throught the [Instant DB documentation](https://www.instantdb.com/docs) to understand how to use it.

Once you have read through the documentation, please insert your own app id in the `src/instant.ts` file.

Feel free to create/modify as many tables as you want within your instant db to accomplish the task below.

## Problems in this implementation that you need to fix

- We are calling an update operation everytime you drag and drop a node. Because of this, the experience of using the app at it's current state is a little laggy and buggy. Optimize this so we make as little updates as possible.

## Task

![image](https://github.com/user-attachments/assets/163cb439-3b78-4322-a7c4-c0382c8c7749)

This is an example of an AI workflow diagram. The goal of this assignment is to create a similar workflow diagram for a KYC acceptance process. At Ruby, a big bottle neck we have is onboarding new customers through a kyc process. This includes:

- Basic information about a user during sign up
- Fraud detection process that returns a fraud score
- KYC and KYB documents that users upload
- Transaction alerts, and location-based verification

This is intentionally an open ended assignment, so feel free to add any features that you think are relevant to the project. The goal here is to create a workflow that would help Ruby employees and managers review information on users, and help make decisions.

The use of AI in this workflow is as follows but not limited to:

- Automatically categorizing customer information
- Automatically creating a risk score, and recommending actions based on the score.

Due to the sensitive nature of this project, we are not going to provide any real data for this assignment.

## Bonus Points

Feel free to add any bonus points that you think are relevant to the project. Here are some ideas:

- Add multiplayer functionality to the app, and have an indication of the number of users connected to the app. This is very doable using instant db. see this [example](https://www.instantdb.com/examples?app=67d6a4bd-2be0-4590-8f05-9dde6498f8f6#5-reactions)
- Add a chat modal/sidebar to the app, where you can create commands that would modify the react flow graph.
