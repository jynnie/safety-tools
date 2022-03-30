import type { NextApiRequest, NextApiResponse } from "next";

export default async function groupResponse(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { groupId, codename } = req.query;

  if (!groupId || !codename) {
    res.status(405).end();
  }

  await fetch(
    `https://${process.env.DB_NAME}.firebaseio.com/${groupId}/responses/${codename}.json?auth=${process.env.AUTH_TOKEN}`,
  )
    .then(async (response) => {
      if (response.ok) {
        const answers = await response.json();
        res.status(200).json({ ...answers });
      } else {
        res.status(405).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(405).end();
    });
}
