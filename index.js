const express = require('express');
const bodyParser = require('body-parser');
const NobloxJS = require('noblox.js');

require('dotenv/config');

const application = express();
const port = process.env.PORT || 5000;

(async () => {
    await NobloxJS.setCookie(process.env.COOKIE);
})();

application.set(
    'view engine',
    'ejs'
);

application.use(bodyParser.urlencoded({ extended: true }));
application.use(bodyParser.json());
application.use(express.static('public'));

application.get('/', (
    request,
    response
) => {
    response.render('index');
});

application.get('/fetch', async (
    request,
    response
) => {
    const { identifier } = request.query;

    function formatNumber (number) {
        return number.toString().replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ','
        );
    };

    function formatDate (date) {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();

        const period = (hour < 12) ? 'AM' : 'PM';
        const formattedHour = (hour % 12) ? 12 : hour % 12;
        const formattedMinute = (minute < 10) ? `0${minute}` : minute;

        return `${month} ${day}, ${year} at ${formattedHour}:${formattedMinute} ${period}`;
    };

    async function getFetchedProfileInformation (profileIdentifier) {
        try {
            const information = await NobloxJS.getPlayerInfo(Number(profileIdentifier));

            return {
                accountAge: information.age ?? 'Account age not specified',
                description: information.blurb ?? 'No description added',
                displayName: information.displayName ?? information.username,
                followerCount: information.followerCount ?? 'No followers',
                followingCount: information.followingCount ?? 'User not following anyone',
                friendCount: information.friendCount ?? 'No friends yet',
                accountBanned: information.isBanned ? 'Account is banned!' : 'Account is not banned.',
                joinDate: information.joinDate ?? 'Join date not specified',
                previousNames: information.oldNames.join(', ') ?? 'No previous names',
                username: information.username
            };
        } catch (error) {
            console.error(error);

            return {
                accountAge: 'Account age not specified',
                description: 'No description added',
                displayName: 'Unknown',
                followerCount: 'No followers',
                followingCount: 'User not following anyone',
                friendCount: 'No friends yet',
                accountBanned: 'Not specified if banned or not',
                joinDate: 'Join date not specified',
                previousNames: 'No previous names',
                username: 'Unknown'
            };
        };
    };

    const information = await getFetchedProfileInformation(identifier);

        
    response.render(
        'fetch',

        {
            accountAge: formatNumber(Number(information.accountAge)),
            description: information.description,
            displayName: information.displayName,
            followerCount: formatNumber(Number(information.followerCount)),
            followingCount: formatNumber(Number(information.followingCount)),
            friendCount: formatNumber(Number(information.friendCount)),
            accountBanned: information.accountBanned,
            joinDate: formatDate(new Date(information.joinDate)),
            previousNames: information.previousNames,
            username: information.username
        }
    );
});

application.get('/*', (
    request,
    response
) => {
    response.render('404');
});

application.listen(port);
