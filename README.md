# Spark Notes App

A simple and feature-rich notes application built using HTML, CSS, and JavaScript. This app allows users to create, edit, delete, and save notes, with rich text formatting options such as font size, color, text alignment, and more. The application is designed to be easy to use and is fully responsive.

## Features

- **Create and Save Notes**: Users can create new notes and save them to local storage.
- **Edit Notes**: Existing notes can be edited with a new title and content.
- **Formatting Options**: 
  - Change the font size and type
  - Choose text alignment (left, center, right)
  - Select text color
- **Undo/Redo**: Ability to undo or redo changes made to the notes.
- **Responsive Design**: Fully responsive layout to work on various screen sizes.
- **Local Storage**: Notes are saved and retrieved from the browser's local storage, ensuring data persistence even after the page is refreshed.
  
## Use
Visit - https://kwamesa.github.io/note-app/


## Technologies Used

- **HTML**: Structure of the application.
- **CSS**: Styling and layout of the app.
- **JavaScript**: Application logic for handling notes, formatting, and local storage functionality.

## How It Works

### Notes Creation:
- When you create a new note, a new note element is added to the list of saved notes. You can add content, and the note is saved automatically.

### Notes Formatting:
- You can format your note with the toolbar options that allow text alignment, font size, font family, and text color. All changes are reflected instantly in the note.

### Undo/Redo:
- Every change made to the note is tracked, and you can use the undo and redo buttons to navigate through your changes.

### Notes Storage:
- Notes are saved in the browser's local storage. When you return to the app, your notes will be preserved across page reloads.

## Future Enhancements

- Implement **Content Editable** instead of using `<textarea>` for more flexibility in text editing.
- Improve the **user interface** to allow for background changes and more customization options.
- Integrate a **backend** to store notes on the cloud.

## Contributing

Feel free to fork the repository, make improvements, and submit a pull request. If you have any suggestions or find bugs, please create an issue.

## License

This project is open-source and available under the [MIT License](LICENSE).
