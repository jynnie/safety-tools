import type { NextApiRequest, NextApiResponse } from "next";

export default async function checkCodename(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { groupId, codename } = req.query;

  if (!groupId || !codename) {
    res.status(405).end();
  }

  await fetch(
    `https://${process.env.DB_NAME}.firebaseio.com/${groupId}/codenames.json?auth=${process.env.AUTH_TOKEN}`,
  )
    .then(async (response) => {
      const codenames = await response.json();

      if (Object.values(codenames || {}).includes(codename)) {
        res.status(200).json({ isValid: true });
      } else {
        res.status(200).json({ isValid: false });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(405).end();
    });
}
