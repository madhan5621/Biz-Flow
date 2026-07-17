import prisma from '../config/db.js';

/**
 * Get company settings (create default if none exist).
 */
export const getSettings = async () => {
  let settings = await prisma.companySettings.findFirst();

  if (!settings) {
    settings = await prisma.companySettings.create({
      data: {},
    });
  }

  return settings;
};

/**
 * Update company settings.
 */
export const updateSettings = async (data) => {
  let settings = await prisma.companySettings.findFirst();

  if (!settings) {
    settings = await prisma.companySettings.create({ data });
  } else {
    settings = await prisma.companySettings.update({
      where: { id: settings.id },
      data,
    });
  }

  return settings;
};
