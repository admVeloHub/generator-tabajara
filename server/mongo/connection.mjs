/** connection.mjs v1.0.0 — Atlas b2c_chamados + b2c_cadastros */
import mongoose from 'mongoose';

const globalCache = globalThis;

function resolveMongoUri(env = process.env) {
  return String(env.MONGODB_URI || env.MONGO_URI || '').trim();
}

function resolveDbNames(env = process.env) {
  return {
    chamados: env.MONGODB_DB_NAME || 'b2c_chamados',
    cadastros: env.MONGODB_CADASTROS_DB_NAME || 'b2c_cadastros',
  };
}

export async function ensureMongoConnections(env = process.env) {
  const uri = resolveMongoUri(env);
  if (!uri) {
    throw new Error('Configure MONGO_URI (ou MONGODB_URI) nas variáveis de ambiente.');
  }

  const { chamados, cadastros } = resolveDbNames(env);

  if (!globalCache.__geradorMongo) {
    globalCache.__geradorMongo = {
      promise: null,
      cadastrosConn: null,
    };
  }

  const cache = globalCache.__geradorMongo;

  if (cache.promise) {
    await cache.promise;
    return { cadastrosConn: cache.cadastrosConn };
  }

  cache.promise = (async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { dbName: chamados });
    }

    if (!cache.cadastrosConn || cache.cadastrosConn.readyState !== 1) {
      cache.cadastrosConn = mongoose.createConnection(uri, { dbName: cadastros });
      await cache.cadastrosConn.asPromise();
    }
  })();

  await cache.promise;
  return { cadastrosConn: cache.cadastrosConn };
}

export function getCadastrosConnection(env = process.env) {
  const cache = globalCache.__geradorMongo;
  if (!cache?.cadastrosConn || cache.cadastrosConn.readyState !== 1) {
    throw new Error('Conexão b2c_cadastros indisponível');
  }
  return cache.cadastrosConn;
}
