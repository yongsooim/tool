import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import firwin, freqz
from scipy.special import i0

class AudioFilterEqualizer:
    def __init__(self, sample_rate_hz, block_size):
        self.sample_rate_hz = sample_rate_hz
        self.block_size = block_size
        self.cf32f = None
        self.nFIR = 0
        self.nBands = 0
        self.fir_inst = None
        self.bypass = False

    def update(self, block):
        if self.bypass:
            return block

        if self.cf32f is None:
            return block

        if block is None:
            return block

        block_new = np.zeros_like(block)
        block_new = np.convolve(block, self.cf32f, mode='same')
        return block_new

    def equalizerNew(self, nBands, feq, adb, nFIR, cf32f, kdb):
        if nFIR < 5 or nFIR > 400:
            return 1  # ERR_EQ_NFIR

        if nBands < 2 or nBands > 50:
            return 2  # ERR_EQ_BANDS

        self.cf32f = cf32f
        self.nFIR = nFIR
        self.nBands = nBands

        if nFIR % 2 == 0:
            nFIR -= 1

        nHalfFIR = (nFIR - 1) // 2

        for kk in range(nFIR):
            cf32f[kk] = 0.0

        aVolts = np.power(10.0, 0.05 * np.array(adb))
        fNorm = np.array(feq) / self.sample_rate_hz

        cf32f[nHalfFIR] = 2.0 * aVolts[0] * fNorm[0]
        for i in range(1, nBands):
            cf32f[nHalfFIR] += 2.0 * aVolts[i] * (fNorm[i] - fNorm[i - 1])

        for j in range(1, nHalfFIR + 1):
            q = np.pi * j
            cf32f[j + nHalfFIR] = aVolts[0] * np.sin(fNorm[0] * 2.0 * q) / q
            for i in range(1, nBands):
                cf32f[j + nHalfFIR] += aVolts[i] * (
                    np.sin(fNorm[i] * 2.0 * q) / q - np.sin(fNorm[i - 1] * 2.0 * q) / q
                )

        if kdb < 0:
            return 3  # ERR_EQ_SIDELOBES

        if kdb > 50:
            beta = 0.1102 * (kdb - 8.7)
        elif 20.96 < kdb <= 50.0:
            beta = 0.58417 * (kdb - 20.96) ** 0.4 + 0.07886 * (kdb - 20.96)
        else:
            beta = 0.0

        kbes = 1.0 / i0(beta)

        scaleXj2 = 2.0 / nFIR
        scaleXj2 *= scaleXj2

        for j in range(nHalfFIR + 1):
            xj2 = (0.5 + j) ** 2
            xj2 = scaleXj2 * xj2
            WindowWt = kbes * i0(beta * np.sqrt(1.0 - xj2))
            cf32f[nHalfFIR + j] *= WindowWt
            cf32f[nHalfFIR - j] = cf32f[nHalfFIR + j]

        self.fir_inst = firwin(nFIR, [fNorm[0], fNorm[-1]], window=('kaiser', beta), pass_zero=False)

        return 0

    def getResponse(self, nFreq, rdb):
        nHalfFIR = (self.nFIR - 1) // 2
        piOnNfreq = np.pi / nFreq

        for i in range(nFreq):
            bt = self.cf32f[nHalfFIR]
            for j in range(nHalfFIR):
                bt += 2.0 * self.cf32f[j] * np.cos(piOnNfreq * (nHalfFIR - j) * i)
            rdb[i] = 20.0 * np.log10(np.abs(bt))

# Usage example:
sample_rate_hz = 48000
block_size = 128

equalizer = AudioFilterEqualizer(sample_rate_hz, block_size)

#feq = [1, 50, 60, 130, 150, 180, 460, 650, 660, 750, 800, 850, 976, 1050, 2150, 2180, 2200, 3050, 4000, 4050, 10000]
#adb = [-96,-96,  0,   0,   3,   0,   0,   0,   0,   0,  -3,   0,  -3,   0,    0,    -3,   0,   -6,    0,  -96,   -96]
feq = [300, 1100, 3100, 22000]
adb = [0, 0, 0, 0]

nBands = min(len(feq), len(adb))

nFIR = 251
cf32f = np.zeros(nFIR)
kdb = 30

equalizer.equalizerNew(nBands, feq, adb, nFIR, cf32f, kdb)

# Get response
nFreq = 200
rdb = np.zeros(nFreq)
equalizer.getResponse(nFreq, rdb)

# Plot the response
#frequencies = np.linspace(0, sample_rate_hz / 2, nFreq)
frequencies = np.linspace(0, sample_rate_hz / 2, nFreq)
plt.plot(frequencies, rdb)
plt.title("Equalizer Frequency Response")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Gain (dB)")
plt.grid()
plt.show()
