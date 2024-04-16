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

    async function getFetchedProfileInformation (profileIdentifier) {
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
    };

    const information = await getFetchedProfileInformation(identifier);

    response.render(
        'fetch',

        {
            accountAge: information.accountAge,
            description: information.description,
            displayName: information.displayName,
            followerCount: information.followerCount,
            followingCount: information.followingCount,
            friendCount: information.friendCount,
            accountBanned: information.accountBanned,
            joinDate: information.joinDate,
            previousNames: information.previousNames,
            username: information.username
        }
    );
});

application.listen(port);
