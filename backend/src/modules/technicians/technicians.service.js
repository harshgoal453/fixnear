const techniciansRepository = require('./technicians.repository');

class TechniciansService {
  async getTechnicians(filters) {
    const rawList = techniciansRepository.findFiltered(filters);
    return rawList.map(t => ({
      ...t,
      skills: JSON.parse(t.skills || '[]')
    }));
  }

  async getTechnicianById(id) {
    const tech = techniciansRepository.findById(id);
    if (!tech) {
      throw new Error('Technician profile not found');
    }
    tech.skills = JSON.parse(tech.skills || '[]');
    const reviews = techniciansRepository.findReviewsByTechId(id);
    return { technician: tech, reviews };
  }

  async updateTechnician(id, updateData) {
    const existing = techniciansRepository.findById(id);
    if (!existing) {
      throw new Error('Technician not found');
    }

    let updatedVerified = existing.verified;
    if (updateData.verification_doc && updateData.verification_doc !== existing.verification_doc && existing.verified === 2) {
      updatedVerified = 0; // Reset to pending if re-submitting document
    }

    const updated = techniciansRepository.update(id, {
      ...updateData,
      verified: updatedVerified
    });
    updated.skills = JSON.parse(updated.skills || '[]');
    return updated;
  }
}

module.exports = new TechniciansService();
