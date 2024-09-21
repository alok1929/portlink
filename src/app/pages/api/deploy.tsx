import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const projectId = 'team_zx1T3VUMMDpm6GpVRHXgV9Hi';
    const token = 'DWJK45T7TrKEhf768ppdDvd2';

    const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `portfolio-${username}-${uuidv4()}`,
        target: 'production',
        gitSource: {
          type: 'github',
          repo: 'alok1929/portfolio',
          ref: 'main',
        },
        env: {
          USERNAME: username,
        },
      }),
    });

    const data = await response.json();

    if (data.url) {
      const portfolioUrl = `https://${data.url}/${username}-resume`;
      res.status(200).json({ url: portfolioUrl });
    } else {
      res.status(500).json({ message: 'Deployment failed' });
    }
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}