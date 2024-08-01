# Monthly Calendar Timeline

![image](https://github.com/user-attachments/assets/45d78616-0667-402d-8291-431d27f7e1fd)
![image](https://github.com/user-attachments/assets/969e4e30-33c0-4542-8540-3bb1b0175bac)


## Overview

This project is a versatile and interactive monthly calendar timeline built with React and TypeScript. It supports event management with drag-and-drop functionality, resource allocation, and responsive design. The calendar provides an intuitive interface for viewing and managing events across different resources.

## Features

- **Event Management**: Create, update, and delete events.
- **Resource Allocation**: Add and manage resources.
- **Drag-and-Drop**: Move and resize events using drag-and-drop.
- **Interactive Modals**: Edit events and resources through modals.
- **Responsive Design**: Adjusts to different screen sizes.
- **Dynamic Color Coding**: Events can be color-coded for better visibility.
- **Save Events and Resources in Local Storage**
- **Resizeable EventBar from both sides**

## Installation

To set up this project locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/devmustafa03/monthly-calendar-timeline.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd monthly-calendar-timeline
   ```

3. **Install Dependencies**

   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, run:

   ```bash
   npm install
   ```

4. **Start the Development Server**

   ```bash
   npm run dev
   ```

   This will start the development server and open the application in your default web browser.

## Usage

### Context and Reducer

The `CalendarProvider` component uses React Context and Reducer to manage the state of the calendar. It provides the following functionalities:

- **`createEvent(date: Dayjs, resource: string)`**: Creates a new event and adds it to the calendar.

### Components

- **`FinalCalendar`**: The main calendar component that integrates the header, grid, and modals.
- **`CalendarHeader`**: Displays the current month and provides navigation and resource management.
- **`CalendarGrid`**: Renders the calendar cells for each day and resource.
- **`CalendarCell`**: A cell in the calendar grid where events are displayed and managed.
- **`EventBar`**: Represents an event in the calendar with drag-and-drop and resizing capabilities.
- **`EventModal`**: A modal for creating or editing events.
- **`ResourceModal`**: A modal for adding new resources.

### Hooks

- **`useCalendar`**: Custom hook for accessing the calendar context and dispatching actions.

## API

### State Management

- **State**: `CalendarState` includes events, resources, and the current date.
- **Actions**:
  - `ADD_EVENT`: Adds a new event to the calendar.
  - `UPDATE_EVENT`: Updates an existing event.
  - `DELETE_EVENT`: Deletes an event.
  - `ADD_RESOURCE`: Adds a new resource.
  - `SET_CURRENT_DATE`: Sets the current date in the calendar.

## Development

### Project Structure

- **`src/`**: Contains all source files.
  - **`components/`**: React components.
  - **`context/`**: Calendar context and provider.
  - **`hooks/`**: Custom React hooks.
  - **`types/`**: TypeScript type definitions.
  - **`utils/`**: Utility functions and constants.

## Acknowledgements

- **React**: For building the user interface.
- **Day.js**: For date manipulation.
- **React DnD**: For drag-and-drop functionality.
- **Tailwind CSS**: For styling.

## Questions

### Q 3 things that you learned from this assignment?

- **Dayjs library**: I learn to use dayjs for finding date calculate the timing finding the between range using isBetween. This library ease work of calculation.
- **Drag Drop Feature**: I learn how to use react-dnd library to implement drag n drop between cells.
- **Resizable event bar**: I learn about how to merge the date and time to implement resizability of the event bars.

### Q What was the most difficult part of the assignment?

The main difficult part is to implement the overlaping of the multiple events so I make them come below the previous ones but it doen't cover some edge cases.

### Q What you would have done differently given more time?

I would make the UX more smooth, implement dark and light mode, added language support other than english and a collab feature.

## Contact

For any questions or feedback, please contact [mustafaazad533@gmail.com](mailto:mustafaazad533@gmail.com).
