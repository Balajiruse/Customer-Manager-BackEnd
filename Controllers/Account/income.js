

import { Income } from "../../schema/income.js";

export async function getAllIncome(userId) {
  try {
    return await Income.find({ userId: userId });
  } catch (error) {
    throw new Error(`Error fetching income data: ${error.message}`);
  }
}

export async function newIncome(data) {
  try {
    return await Income(data).save();
  } catch (error) {
    throw new Error(`Error creating new income: ${error.message}`);
  }
}

export async function getIncome(id) {
  try {
    return await Income.findOne({ _id: id });
  } catch (error) {
    throw new Error(`Error fetching income details: ${error.message}`);
  }
}

export async function deleteIncome(id) {
  try {
    return await Income.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(`Error deleting income: ${error.message}`);
  }
}

export async function editIncome(id, data) {
  try {
    return await Income.updateOne({ _id: id }, { $set: data });
  } catch (error) {
    throw new Error(`Error editing income: ${error.message}`);
  }
}
