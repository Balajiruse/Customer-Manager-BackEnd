
import { Expense } from "../../schema/expense.js";

export async function Getallexpenses(userId) {
  try {
    return await Expense.find({ userId: userId });
  } catch (error) {
    throw new Error(`Error fetching expense data: ${error.message}`);
  }
}

export async function NewExpense(data) {
  try {
    return await Expense(data).save();
  } catch (error) {
    throw new Error(`Error creating new expense: ${error.message}`);
  }
}

export async function getexpense(id) {
  try {
    return await Expense.findOne({ _id: id });
  } catch (error) {
    throw new Error(`Error fetching expense details: ${error.message}`);
  }
}

export async function deleteexpense(id) {
  try {
    return await Expense.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(`Error deleting expense: ${error.message}`);
  }
}

export async function editExpense(id, data) {
  try {
    return await Expense.updateOne({ _id: id }, { $set: data });
  } catch (error) {
    throw new Error(`Error editing expense: ${error.message}`);
  }
}
