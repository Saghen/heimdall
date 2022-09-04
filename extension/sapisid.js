/**
 * REPLACE THIS WITH SHA1 BECAUSE THATS ALL IT IS :)
 */
function hashSAPISID(SAPISID) {
  const time = Math.floor(new Date().getTime() / 1000)
  const combined = `${time} ${SAPISID} https://www.youtube.com`

  const yo = dea()
  yo.update(combined)

  return `SAPISIDHASH ${[time, yo.digestString().toLowerCase()].join('_')}`
}

function dea() {
  function a() {
    f[0] = 1732584193
    f[1] = 4023233417
    f[2] = 2562383102
    f[3] = 271733878
    f[4] = 3285377520
    v = r = 0
  }
  function b(z) {
    for (var C = l, F = 0; 64 > F; F += 4)
      C[F / 4] = (z[F] << 24) | (z[F + 1] << 16) | (z[F + 2] << 8) | z[F + 3]
    for (F = 16; 80 > F; F++)
      (z = C[F - 3] ^ C[F - 8] ^ C[F - 14] ^ C[F - 16]),
        (C[F] = ((z << 1) | (z >>> 31)) & 4294967295)
    z = f[0]
    var E = f[1],
      R = f[2],
      ka = f[3],
      oa = f[4]
    for (F = 0; 80 > F; F++) {
      if (40 > F) {
        if (20 > F) {
          var ra = ka ^ (E & (R ^ ka))
          var nb = 1518500249
        } else (ra = E ^ R ^ ka), (nb = 1859775393)
      } else
        60 > F
          ? ((ra = (E & R) | (ka & (E | R))), (nb = 2400959708))
          : ((ra = E ^ R ^ ka), (nb = 3395469782))
      ra = ((((z << 5) | (z >>> 27)) & 4294967295) + ra + oa + nb + C[F]) & 4294967295
      oa = ka
      ka = R
      R = ((E << 30) | (E >>> 2)) & 4294967295
      E = z
      z = ra
    }
    f[0] = (f[0] + z) & 4294967295
    f[1] = (f[1] + E) & 4294967295
    f[2] = (f[2] + R) & 4294967295
    f[3] = (f[3] + ka) & 4294967295
    f[4] = (f[4] + oa) & 4294967295
  }
  function c(z, C) {
    if ('string' === typeof z) {
      z = unescape(encodeURIComponent(z))
      for (var F = [], E = 0, R = z.length; E < R; ++E) F.push(z.charCodeAt(E))
      z = F
    }
    C || (C = z.length)
    F = 0
    if (0 == r) for (; F + 64 < C; ) b(z.slice(F, F + 64)), (F += 64), (v += 64)
    for (; F < C; )
      if (((h[r++] = z[F++]), v++, 64 == r))
        for (r = 0, b(h); F + 64 < C; ) b(z.slice(F, F + 64)), (F += 64), (v += 64)
  }
  function d() {
    var z = [],
      C = 8 * v
    56 > r ? c(m, 56 - r) : c(m, 64 - (r - 56))
    for (var F = 63; 56 <= F; F--) (h[F] = C & 255), (C >>>= 8)
    b(h)
    for (F = C = 0; 5 > F; F++) for (var E = 24; 0 <= E; E -= 8) z[C++] = (f[F] >> E) & 255
    return z
  }
  for (var f = [], h = [], l = [], m = [128], n = 1; 64 > n; ++n) m[n] = 0
  var r, v
  a()
  return {
    reset: a,
    update: c,
    digest: d,
    digestString: function () {
      for (var z = d(), C = '', F = 0; F < z.length; F++)
        C += '0123456789ABCDEF'.charAt(Math.floor(z[F] / 16)) + '0123456789ABCDEF'.charAt(z[F] % 16)
      return C
    },
  }
}
