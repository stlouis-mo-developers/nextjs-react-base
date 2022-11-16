// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../models/User';
import { MockData } from '../../services/mockData';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const mockServer = MockData;
  const body = req.body;
  const { slug } = req.query;

  if (req.method === 'POST') {
    if (body.Username && body.Password) {
      const data = mockServer.getUsers();

      const item: User = { ITCC_UserID: data.length + 1, Username: body.Username, Password: body.Password };
      data.push(item);

      mockServer.saveUsers(data);

      res.status(200).json(mockServer.getUsers());
    }
    else {
      return res.status(400).json({ errors: 'Username or password not found' })
    }

  }
  else if (req.method === 'GET') {
    //const mockServer = new MockData();
    const data = mockServer.getUsers();

    console.log({ req: req.method, slug: slug, mockServer: mockServer });
    res.status(200).json(data);
  }
  else {
    res.status(401);
  }
}