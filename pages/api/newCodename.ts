import type { NextApiRequest, NextApiResponse } from "next";

export default async function newCodename(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { groupId, codename } = req.body;

  if (!groupId || !codename) {
    res.status(405).end();
  }

  if (req.method === "POST") {
    await fetch(
      `https://${process.env.DB_NAME}.firebaseio.com/${groupId}/codenames.json?auth=${process.env.AUTH_TOKEN}`,
      {
        method: "patch",
        body: JSON.stringify({ [codename]: codename }),
      },
    )
      .then(async (response) => {
        if (response.ok) {
          res.status(200).json({ codename });
        } else {
          res.status(405).end();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(405).end();
      });
  } else {
    res.status(405).end();
  }
}
