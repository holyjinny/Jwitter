let users = [
    {
        id: '1',
        username: 'jinny',
        password: '$2b$11$HPwPHAJk4dXOCZzBnPHyJebFTww9TtrFxNEAnAjjrBBcmlHBYA/jG', // 12345
        name: 'Jinny',
        email: 'jinny@gmail.com',
        url: '',
    },
];

export async function findByUsername(username) {
    return users.find((user) => user.username === username);
}

export async function findById(id) {
    return users.find((user) => user.id === id);
}

/**
 * @method POST
 * @api /auth/signup
 * @access public
 * @description 회원 가입
 */
export async function createUser(user) {
    const created = { ...user, id: Date.now().toString() };
    users.push(created);
    return created.id;
}