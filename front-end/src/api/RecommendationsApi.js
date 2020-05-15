import axios from 'axios';

const MOCK_USERS = [
  {
    id: 100,
    email: 'test123@gmail.com',
  },
  {
    id: 101,
    email: 'test321@gmail.com',
  },
  {
    id: 102,
    email: 'test213@gmail.com',
  },
  {
    id: 103,
    email: 'test312@gmail.com',
  },
  {
    id: 104,
    email: 'test111@gmail.com',
  },
]

export async function fetchRecommendedUsers(userId) {
  return Promise.resolve(MOCK_USERS);
}