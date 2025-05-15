import { ProjectNote } from '../models/notes.model';
import { ApiResponse } from '../utils/api-response';

const getNotes = async (req, res) => {
  try {
    const allNotes = await ProjectNote.find({});

    if (!allNotes) {
      throw new ApiError(400, 'Notes not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, allNotes, 'Notes fetched succussfully'));
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong at getNotes controller',
      error
    );
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new ApiError(500, 'Id not found');
    }
    const note = await ProjectNote.findById(id);

    if (!note) {
      throw new ApiError(500, 'note not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, 'Note fetched succcessfully'));

  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong at getNoteById controller',
      error
    );
  }
};

const createNote = async (req, res) => {
  
};

const updateNote = async (req, res) => {
  // update note
};

const deleteNote = async (req, res) => {
  // delete note
};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
