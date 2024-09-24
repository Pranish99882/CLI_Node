const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
const usersFile = path.join(__dirname, 'users.json'); // Path to users.json file

let users = []; // In-memory user storage

// Load users from file if exists
if (fs.existsSync(usersFile)) {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        users = JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
    }
}

program
    .command('create')
    .description('Create a new user')
    .requiredOption('-f, --fname <firstname>', 'First name')
    .requiredOption('-l, --lname <lastname>', 'Last name')
    .action((cmd) => {
        const { fname, lname } = cmd;
        users.push({ fname, lname });
        saveUsersToFile();
        console.log(`User ${fname} ${lname} created.`);
    });

program
    .command('delete')
    .description('Delete a user')
    .requiredOption('-f, --fname <firstname>', 'First name')
    .option('--all', 'Delete all users with the given first name')
    .action((cmd) => {
        const { fname, all } = cmd;
        if (all) {
            const initialLength = users.length;
            users = users.filter(user => user.fname !== fname);
            if (users.length < initialLength) {
                console.log(`All users with first name ${fname} deleted.`);
            } else {
                console.log(`No users found with first name ${fname}.`);
            }
        } else {
            const index = users.findIndex(user => user.fname === fname);
            if (index !== -1) {
                const user = users.splice(index, 1)[0];
                console.log(`User ${user.fname} ${user.lname} deleted.`);
            } else {
                console.log(`No user found with first name ${fname}.`);
            }
        }
        saveUsersToFile();
    });

program
    .command('list')
    .description('List all users')
    .action(() => {
        console.log('Users:');
        users.forEach(user => {
            console.log(`${user.fname} ${user.lname}`);
        });
    });

// Function to save users array to file
function saveUsersToFile() {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

module.exports = program;
