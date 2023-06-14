const prisma = require("../../prisma");

exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name
    ? { where: { name: { contains: name, mode: "insensitive" } } }
    : {};

  prisma.artist
    .findMany(condition)
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving artists.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  prisma.artist
    .findUnique({ where: { id: Number(id) } })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Artist with id " + id });
      else res.send({ data });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Artist with id=" + id });
    });
};

exports.getTopThree = async (req, res) => {
  try {
    const topThreeArtists = await prisma.$queryRaw`
     SELECT a.id, a.name, SUM(s.playbacks) AS totalPlaybacks
      FROM Artist AS a
      JOIN Song AS s ON s.artistId = a.id
      GROUP BY a.id, a.name
      ORDER BY totalPlaybacks DESC
      LIMIT 3
  `;

    res.send({ data: topThreeArtists });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving artists.",
    });
  }
};
