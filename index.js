const express = require('express');
const bodyParser = require('body-parser');
const NobloxJS = require('noblox.js');

require('dotenv/config');

const application = express();
const port = process.env.PORT || 5000;

(async () => {
    await NobloxJS.setCookie('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CF77737068104B87A1E78328346FC012069A9E0D832BFFD3CD6F946159FB74CE36AF9F34C27837135588704390AF8F4A183DB8CC1F904854A566809F4045072DEBB02B5A5F2E5E1B2F2C795F7096EEF808048E3D2BB7CDF8C36A03E4A1165DBB380A97C8727B455E2EEFA1D3C3EAE09C3DA670AE132ACD7735806F2630D5B8F307F3F01E1692986C88E762730EA837B64E3A4BECD30FC46BB127EA8C21167DE41FC256566716CCD9815583D4657E21DE675A6642A10A080C945A00DC42D21A0B28D8EC4047EB86D3A47C6CB884F2892BEC3DD81594633859D6120AEB3CFCC3DB6558C2000FEB604E5D4492A4DEF7D866483729249D8A8228329719CB3E2088348F3945D6CF0532AC131BDEDC903893FCBA653233693225F29C2250D06F1204BAAEAC6B3CB974F44F1BE29F1357B37A2728B3DC71823BA263F4D23C0530C590FBE9C3189E4FEC125D028290EB7524D7C8E2FA0E9B1B9D9AEB6EAA0D3BBE4A88FF50C4006EFE518262FD3D45557D354A39E179C5A3063513A0258EF8851FB3FCAB204D15C5B18220FF65FD1AEF1AC62EF9C4314760C3A5E0F69C8586DD95269BF851228418F8A8BA7A3D6B49C2124166526C69B48CDE0E52581AE75EDA00AE77FFAE7204F3B86BB295B4D45CFEB0A27CED9A8B2DAF4CCF95D93801813B438311744155A67F9278929F0776D05B5A81D0750BF8A9CDD9B49BBB865E9E5C0DDCCDD7ED4F196D75CEA79FD47B9C26D0CD4CAF932016CC76CB2A12395EE240618198A2DA8C4BCAA89709ECE10E1251B613072EE37A1B41E97CDF695D00B8CC037CE883F8F024F8CAA5ECE8D329C2B4DC278FBC7119A5DDF50EAD56151B3B99FD23D86780853EA00C7F1FF547D59FC7EC5AF4DA5E4F366845FEBF8C888376AF104556147851A0EB600FD845168293E2FA7088DDDE71D92DECDC47744F3C98ED1100B92BB4C08EFA64E9FC2443CD03E7711AEC788F30CBBF97E4D96905887A8F7AF852F84B347F63C46E6A5764043E26E32ACBDD484C065A95FEFFFFED1BE7DF640CCEDB29BB926BA2EFFE888EB653AB58DD393320D6BE0E');
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
