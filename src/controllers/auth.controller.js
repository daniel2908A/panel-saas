exports.register = async (req, res) => {
  try {
    const { username, email, password, ref, role } = req.body;

    // 🔎 validar
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 🔐 validar rol
    const userRole = ['reseller', 'super_reseller'].includes(role)
      ? role
      : 'reseller';

    // 🔎 verificar duplicado
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya existe" });
    }

    // 🔐 hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 generar código propio
    const refCode = generateRefCode(username);

    // 🔗 buscar referido
    let parentId = null;

    if (ref) {
      const [refUser] = await db.query(
        "SELECT id FROM users WHERE ref_code = ?",
        [ref]
      );

      if (refUser.length > 0) {
        parentId = refUser[0].id;
      }
    }

    // 👤 crear usuario con rol dinámico
    await db.query(
      `INSERT INTO users 
      (username, email, password, role, credits, ref_code, parent_id) 
      VALUES (?, ?, ?, ?, 0, ?, ?)`,
      [username, email, hashedPassword, userRole, refCode, parentId]
    );

    res.json({
      message: "Usuario registrado correctamente",
      role: userRole,
      ref_code: refCode
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};