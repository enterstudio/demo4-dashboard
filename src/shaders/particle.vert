// PATH_NODES is how many nodes there are in each particle's path
#define PATH_NODES ${PATH_NODES}

// two components to each path node, x and y
#define PATH_COMPONENTS ${PATH_COMPONENTS}

// how many paths there are (can't pass this in dynamically; array indices must be static)
#define PATH_COUNT ${PATH_COUNT}

// how many floats are in a single path
#define PATH_LENGTH (PATH_NODES*PATH_COMPONENTS)

// how much to spread out the particles
#define SPREAD ${PATH_SPREAD}

#define DISCARD_THIS -1234567890.0

attribute vec3 color;
attribute float progress;
attribute float path;
attribute float moveDelay;
attribute float variation;

uniform float size;
uniform float paths[PATH_NODES * PATH_COMPONENTS * PATH_COUNT];
uniform float loopParticles;
uniform float xStart;
uniform float xEnd;

varying float vDiscard;
varying vec2 vPathPos;
varying float vOpacity;

// p = progress [0..1)
// pn = path number, indicating whether this particle should use path 0, path 1, etc
vec2 pointOnPath(float p, int pn, bool hideStationary) {
    p = clamp(p, 0.0, 1.0);

    int path_i = PATH_LENGTH * pn;
    float path_progress = p * float((PATH_NODES - PATH_COMPONENTS + 1) * PATH_COMPONENTS);
    int x1i = path_i + int(path_progress / 2.0) * 2;
    int y1i = x1i + 1;
    int x2i = x1i + PATH_COMPONENTS;
    int y2i = x2i + 1;

    float a = fract(p * float((PATH_NODES - PATH_COMPONENTS + 1)));

    // vary the positions per particle to spread them out out
    float pvar = (progress + moveDelay + variation) * variation * 10.0;
    float xvar = variation * SPREAD * (sin(pvar) + cos(pvar));
    float yvar = variation * SPREAD * (cos(pvar) - sin(pvar));

    vec2 p1 = vec2(paths[x1i] + xvar, paths[y1i] + yvar);
    vec2 p2 = vec2(paths[x2i] + xvar, paths[y2i] + yvar);

    // if the particle isn't moving, this means that it has reached the end of
    // its path, but it was on a path that has padding end points.  we don't
    // want those particles to stay visible just sitting there, so let our
    // friend the fragment shader know to discard this particle with 
    if (hideStationary && p1 == p2) {
        return vec2(DISCARD_THIS, 0.0);
    }

    vec2 pos = mix( p1, p2, a );

    return pos;
}

void main() {

    // if loopParticles is enabled, then mod the progress, causing the
    // particles to restart their paths upon completion
    float p = progress;

    bool shouldLoop = loopParticles == 1.0;

    if (shouldLoop) {
        p = mod(p, 1.0);
    }

    vec2 pathPos = pointOnPath(p, int(path), shouldLoop);
    vPathPos = pathPos;

    /* float xStart = 500.0; */
    /* float xEnd = 2190.0; */
    float xProgress = (pathPos.x - xStart) / (xEnd - xStart);
    vOpacity = 1.0 - pow(2.0 * xProgress - 1.0, 8.0);
    /* vOpacity = xProgress; */

    if (pathPos.x == DISCARD_THIS) {
        vDiscard = 1.0;
        return;
    }

    vec4 mvPosition = modelViewMatrix * vec4( pathPos, 0.0, 1.0 );

    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
}
